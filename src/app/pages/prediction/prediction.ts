import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../layout/navbar/navbar';

interface PredictionData {
  ville: string;
  ca: number;
  enc: number;
  dec: number;
  sol: number;
  sr: number;
  dep: number;
}

interface PredictionResult {
  enc_pred: number;
  dec_pred: number;
  solde_ia: number;
  score_ia: number | null;
  score_man: number | null;
  simulated: boolean;
}

interface ScoreResult {
  ia: number;
  man: number;
  diff: number;
  best: 'ia' | 'man' | 'tie';
}

interface BarData {
  label: string;
  val: number;
  cls: string;
  pct: number;
  animated: boolean;
}

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar],
  templateUrl: './prediction.html',
  styleUrls: ['./prediction.css']
})
export class Prediction implements OnInit, OnDestroy {

  // ── Config ──
  private readonly API = 'http://127.0.0.1:8000';

  // ── API Status ──
  apiStatus = 'Connexion API…';
  apiStatusColor = '';
  apiConnected = false;

  // ── Form Data ──
  ville = '';
  ca: number | null = null;
  sr = 30;
  dep = 45;
  enc: number | null = null;
  dec: number | null = null;
  sol: number | null = null;

  // ── Villes ──
  villes = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
    'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan',
    'El Jadida', 'Safi'
  ];

  // ── State ──
  loading = false;
  showResults = false;
  showEmpty = true;
  isSimulated = false;

  // ── Results ──
  rIA = '—';
  rMAN = '—';
  rREEL = '—';
  dENC = '—';
  dDEC = '—';

  // ── Scores ──
  scoreIA = 0;
  scoreMan = 0;
  scoreIADisplay = '—';
  scoreManDisplay = '—';
  barWidthIA = 0;
  barWidthMan = 0;

  // ── Verdict ──
  verdictText = '';
  verdictClass = '';

  // ── Conseils ──
  advices: string[] = [];

  // ── Bar Chart ──
  bars: BarData[] = [];

  // ── Slider backgrounds ──
  srBackground = '';
  depBackground = '';

  private animationTimer: any;

  ngOnInit(): void {
    this.checkAPI();
    this.updateSliderBackground('sr');
    this.updateSliderBackground('dep');
  }

  ngOnDestroy(): void {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
  }

  // ── Slider sync ──
  onSliderChange(type: 'sr' | 'dep'): void {
    this.updateSliderBackground(type);
  }

  updateSliderBackground(type: 'sr' | 'dep'): void {
    const val = type === 'sr' ? this.sr : this.dep;
    const bg = `linear-gradient(to right, var(--b5) ${val}%, var(--b1) ${val}%)`;
    if (type === 'sr') {
      this.srBackground = bg;
    } else {
      this.depBackground = bg;
    }
  }

  get srDisplay(): string {
    return `${this.sr}`;
  }

  get depDisplay(): string {
    return `${this.dep}%`;
  }

  // ── Format ──
  fmt(n: number): string {
    return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(n) + ' MAD';
  }

  // ── Health check ──
  async checkAPI(): Promise<void> {
    try {
      const response = await fetch(`${this.API}/health`);
      const data = await response.json();
      if (data.lstm_loaded && data.gru_loaded) {
        this.apiStatus = 'Modèles opérationnels ✓';
        this.apiConnected = true;
      } else if (data.lstm_loaded) {
        this.apiStatus = 'LSTM ✓ GRU → fallback';
        this.apiConnected = true;
      } else {
        this.apiStatus = 'API connectée';
        this.apiConnected = true;
      }
      this.apiStatusColor = '';
    } catch {
      this.apiStatus = 'API non connectée — mode simulation';
      this.apiStatusColor = '#F59E0B';
      this.apiConnected = false;
    }
  }

  // ── Simulation locale ──
  private simulate(d: PredictionData): PredictionResult {
    const risk = (d.sr * 0.4 + d.dep * 0.6) / 100;
    const vol = 0.08 + risk * 0.12;
    const sf = 1 + 0.05 * Math.sin(new Date().getMonth() / 2);
    const encPred = Math.round(
      d.enc * (1 + 0.02 * (1 - risk)) * sf * (1 + (Math.random() - 0.5) * vol)
    );
    const decPred = Math.round(
      d.dec * (0.95 + risk * 0.15) * (1 + (Math.random() - 0.5) * vol * 0.5)
    );
    return {
      enc_pred: encPred,
      dec_pred: decPred,
      solde_ia: Math.round((d.enc - d.dec) + (encPred - decPred)),
      score_ia: null,
      score_man: null,
      simulated: true
    };
  }

  // ── Appel API ──
  private async callAPI(d: PredictionData): Promise<PredictionResult> {
    const body = JSON.stringify({
      ville: d.ville,
      ca_mensuel_estime_ht: d.ca,
      score_retard_paiement_odp: d.sr,
      dependance_top_3_clients: d.dep,
      enc_reel: d.enc,
      dec_reel: d.dec,
    });
    const headers = { 'Content-Type': 'application/json' };

    // /compare endpoint
    try {
      const r = await fetch(`${this.API}/compare?solde_manuel=${d.sol}`, {
        method: 'POST',
        headers,
        body
      });
      if (!r.ok) { throw new Error('Not OK'); }
      const j = await r.json();
      return {
        enc_pred: Math.round(j.encaissement_predit),
        dec_pred: Math.round(j.decaissement_predit),
        solde_ia: Math.round(j.solde_ia_t1),
        score_ia: j.score_ia_pct,
        score_man: j.score_manuel_pct,
        simulated: false
      };
    } catch {
      // fall through
    }

    // separate endpoints
    try {
      const [re, rd] = await Promise.all([
        fetch(`${this.API}/predict/encaissement`, { method: 'POST', headers, body }),
        fetch(`${this.API}/predict/decaissement`, { method: 'POST', headers, body }),
      ]);
      const [je, jd] = await Promise.all([re.json(), rd.json()]);
      const si = Math.round(
        (d.enc - d.dec) + je.encaissement_predit - jd.decaissement_predit
      );
      return {
        enc_pred: Math.round(je.encaissement_predit),
        dec_pred: Math.round(jd.decaissement_predit),
        solde_ia: si,
        score_ia: null,
        score_man: null,
        simulated: false
      };
    } catch {
      // fall through
    }

    return this.simulate(d);
  }

  // ── Calcul scores ──
  private calcScores(d: PredictionData, res: PredictionResult): ScoreResult {
    const sr = d.enc - d.dec;
    const prec = (a: number, b: number): number =>
      b === 0 ? 0 : Math.round(Math.max(0, 1 - Math.abs(a - b) / Math.abs(b)) * 100);

    const ia = res.score_ia !== null && res.score_ia !== undefined
      ? Math.round(res.score_ia)
      : prec(res.solde_ia, d.sol);

    const man = res.score_man !== null && res.score_man !== undefined
      ? Math.round(res.score_man)
      : prec(d.sol, sr);

    const diff = ia - man;
    const best: 'ia' | 'man' | 'tie' =
      Math.abs(diff) <= 3 ? 'tie' : diff > 0 ? 'ia' : 'man';

    return { ia, man, diff, best };
  }

  // ── Conseils ──
  private generateConseils(d: PredictionData, sc: ScoreResult): string[] {
    const tips: string[] = [];

    if (sc.best === 'ia') {
      tips.push(
        `🤖 Le modèle IA dépasse votre prévision de ${sc.diff} pts ` +
        `(${sc.ia}% vs ${sc.man}%). Fiez-vous davantage aux prédictions IA.`
      );
    } else if (sc.best === 'man') {
      tips.push(
        `👤 Votre prévision est plus précise de ${Math.abs(sc.diff)} pts ` +
        `(${sc.man}% vs ${sc.ia}%). Documentez vos hypothèses pour enrichir le modèle.`
      );
    } else {
      tips.push(
        `⚖️ Résultats très proches (< 3 pts d'écart). ` +
        `Continuez à alimenter le modèle chaque mois.`
      );
    }

    if (d.sr > 60) {
      tips.push(
        `⚠️ Score retard ODP élevé (${d.sr}/100) : ` +
        `relancez les clients en retard avant la clôture.`
      );
    }

    if (d.dep > 70) {
      tips.push(
        `📊 Dépendance top 3 critique (${d.dep}%) : ` +
        `diversifiez votre portefeuille client.`
      );
    }

    return tips;
  }

  // ── Render results ──
  private render(d: PredictionData, res: PredictionResult): void {
    const sr = d.enc - d.dec;
    const sc = this.calcScores(d, res);

    this.showEmpty = false;
    this.showResults = true;
    this.isSimulated = res.simulated;

    // Cards
    this.rIA = this.fmt(res.solde_ia);
    this.rMAN = this.fmt(d.sol);
    this.rREEL = this.fmt(sr);

    // Décompo
    this.dENC = this.fmt(res.enc_pred);
    this.dDEC = this.fmt(res.dec_pred);

    // Scores
    this.scoreIA = sc.ia;
    this.scoreMan = sc.man;
    this.scoreIADisplay = sc.ia + '%';
    this.scoreManDisplay = sc.man + '%';

    // Animate bars
    this.barWidthIA = 0;
    this.barWidthMan = 0;
    this.animationTimer = setTimeout(() => {
      this.barWidthIA = sc.ia;
      this.barWidthMan = sc.man;
    }, 80);

    // Verdict
    if (sc.best === 'tie') {
      this.verdictClass = 'verd v-tie';
      this.verdictText =
        `⚖️ Résultats équilibrés — IA : ${sc.ia}% vs Manuel : ${sc.man}% (écart < 3 pts).`;
    } else if (sc.best === 'ia') {
      this.verdictClass = 'verd v-ia';
      this.verdictText =
        `🤖 Le modèle IA est plus précis (+${sc.diff} pts) — ${sc.ia}% vs ${sc.man}%.`;
    } else {
      this.verdictClass = 'verd v-man';
      this.verdictText =
        `👤 Votre prévision est meilleure (+${Math.abs(sc.diff)} pts) — ${sc.man}% vs ${sc.ia}%.`;
    }

    // Conseils
    this.advices = this.generateConseils(d, sc);

    // Bar chart
    const barsDef = [
      { label: 'Solde IA\nT+1', val: res.solde_ia, cls: 'bb' },
      { label: 'Prévision\nManuelle', val: d.sol, cls: 'bo' },
      { label: 'Solde\nActuel', val: sr, cls: 'br' },
    ];
    const mx = Math.max(...barsDef.map(b => Math.abs(b.val)), 1);
    this.bars = barsDef.map(b => ({
      label: b.label,
      val: b.val,
      cls: b.cls,
      pct: Math.max(10, Math.abs(b.val) / mx * 100),
      animated: false
    }));

    setTimeout(() => {
      this.bars = this.bars.map(b => ({ ...b, animated: true }));
    }, 120);
  }

  // ── Submit handler ──
  async onSubmit(): Promise<void> {
    if (!this.ville) {
      alert('Veuillez sélectionner une ville.');
      return;
    }
    if (!this.ca || this.ca <= 0) {
      alert('CA mensuel invalide (doit être > 0).');
      return;
    }
    if (this.enc === null || isNaN(this.enc)) {
      alert('Encaissement réel invalide.');
      return;
    }
    if (this.dec === null || isNaN(this.dec)) {
      alert('Décaissement réel invalide.');
      return;
    }
    if (this.sol === null || isNaN(this.sol)) {
      alert('Solde prévu manuel invalide.');
      return;
    }

    this.loading = true;

    try {
      const d: PredictionData = {
        ville: this.ville,
        ca: this.ca,
        enc: this.enc,
        dec: this.dec,
        sol: this.sol,
        sr: this.sr,
        dep: this.dep,
      };

      const res = await this.callAPI(d);
      this.render(d, res);

      if (window.innerWidth < 820) {
        const rp = document.getElementById('rp');
        if (rp) {
          rp.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erreur inattendue. Vérifiez la console (F12).');
    } finally {
      this.loading = false;
    }
  }
}