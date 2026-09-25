export type SemPath = {
  id: string;
  from: string;
  to: string;
  beta: number;
  estimate: number;
  se: number;
  z: number;
  p: number;
  ci: [number, number];
  interpretation: string;
};

export type Indicator = {
  id: string;
  label: string;
  loading: number;
  p: number | string;
};

export type Construct = {
  id: string;
  label: string;
  short: string;
  r2?: number;
  indicators: Indicator[];
  note: string;
};

export const fit = {
  n: 689,
  chiSquare: 470.97,
  df: 153,
  cfi: 0.95,
  tli: 0.938,
  rmsea: 0.055,
  rmseaCI: [0.049, 0.061] as [number, number],
  srmr: 0.038,
  bic: 30256.63,
};

export const constructs: Construct[] = [
  {
    id: "unsafe",
    label: "Unsafe riding",
    short: "Unsafe riding",
    r2: 0.503,
    indicators: [
      { id: "Letih_RLR", label: "Running RL", loading: 0.420, p: "<.001" },
      { id: "Letih_bwk_laju", label: "Speeding", loading: 0.516, p: "<.001" },
      { id: "Letih_ubah_tbt", label: "Beh. Change", loading: 0.508, p: "<.001" },
      { id: "Crash_hist", label: "Crash Hist.", loading: 0.172, p: ".003" },
    ],
    note: "Unsafe Riding is a latent construct in the locked final model. Crash history also loads on Motivation (Dorongan), so this indicator is intentionally cross-loaded rather than silently removed.",
  },
  {
    id: "kurang",
    label: "Low Energy",
    short: "Low Energy",
    r2: 0.745,
    indicators: [
      { id: "CFS_4", label: "M-CFQ4", loading: 0.754, p: "<.001" },
      { id: "CFS_5", label: "M-CFQ5", loading: 0.880, p: "<.001" },
      { id: "CFS_6", label: "M-CFQ6", loading: 0.854, p: "<.001" },
      { id: "CFS_7", label: "M-CFQ7", loading: 0.900, p: "<.001" },
    ],
    note: "The final M-CFQ measurement model separates Low Energy from physical and mental fatigue.",
  },
  {
    id: "mental",
    label: "Mental Fatg.",
    short: "Mental Fatg.",
    r2: 0.273,
    indicators: [
      { id: "CFS_8", label: "M-CFQ8", loading: 0.841, p: "<.001" },
      { id: "CFS_9", label: "M-CFQ9", loading: 0.803, p: "<.001" },
      { id: "CFS_10", label: "M-CFQ10", loading: 0.771, p: "<.001" },
      { id: "CFS_11", label: "M-CFQ11", loading: 0.587, p: "<.001" },
    ],
    note: "Mental fatigue is modelled as a distinct fatigue dimension.",
  },
  {
    id: "physical",
    label: "Phys. Fatg.",
    short: "Phys. Fatg.",
    r2: 0.254,
    indicators: [
      { id: "CFS_1", label: "M-CFQ1", loading: 0.820, p: "<.001" },
      { id: "CFS_2", label: "M-CFQ2", loading: 0.632, p: "<.001" },
      { id: "CFS_3", label: "M-CFQ3", loading: 0.838, p: "<.001" },
    ],
    note: "Physical fatigue is the first of three validated fatigue dimensions in the locked measurement model.",
  },
  {
    id: "prolong",
    label: "Prol. Fatg.",
    short: "Prol. Fatg.",
    r2: 0.974,
    indicators: [
      { id: "P_sleepy", label: "Rode Sleepy", loading: 0.815, p: "<.001" },
      { id: "P_napped", label: "Riding Asleep", loading: 0.394, p: "<.001" },
      { id: "P_month", label: "Fatg. Last Month", loading: 0.814, p: "<.001" },
    ],
    note: "Prolonged fatigue represents longer-term fatigue experience and predicts the three fatigue dimensions in the structural model.",
  },
  {
    id: "motivation",
    label: "Motivation",
    short: "Motivation",
    r2: 1.0,
    indicators: [
      { id: "Tj_mng", label: "Purpose of riding", loading: 0.514, p: ".724" },
      { id: "Umur", label: "Age group", loading: 0.426, p: ".762" },
      { id: "Crash_hist_m", label: "Crash Hist.", loading: -0.293, p: "<.001" },
    ],
    note: "This construct is retained exactly as specified in the locked final model. Two indicators are not the basis of this construct; the model has three indicators, with Crash history cross-loading.",
  },
];


export const directUnsafeInterpretation = [
  { id: "prolong-unsafe", label: "Prolonged fatigue", beta: 0.395, p: 0.000, status: "significant", message: "Higher prolonged-fatigue scores were associated with higher unsafe-riding scores in this model." },
  { id: "motivation-unsafe", label: "Motivation", beta: 0.316, p: 0.000, status: "significant", message: "Higher motivation scores were positively associated with unsafe-riding scores in this model." },
  { id: "mental-unsafe", label: "Mental fatigue", beta: 0.295, p: 0.031, status: "significant", message: "Higher mental-fatigue scores were positively associated with unsafe-riding scores in this model." },
  { id: "physical-unsafe", label: "Physical fatigue", beta: 0.174, p: 0.243, status: "not-significant", message: "The estimated positive association was not statistically significant in the final model." },
  { id: "kurang-unsafe", label: "Low Energy", beta: -0.070, p: 0.711, status: "not-significant", message: "The estimated association was small and negative, but not statistically significant in the final model." },
] as const;

export const paths: SemPath[] = [
  { id:"mental-unsafe", from:"mental", to:"unsafe", beta:0.295, estimate:0.217, se:0.149, z:1.458, p:.031, ci:[-0.043,0.529], interpretation:"Mental fatigue shows a positive association with unsafe riding in the final MLR model (β = 0.295, p = .031). Because this is a cross-sectional SEM, the path should be read as a modelled association rather than proof of causality." },
  { id:"physical-unsafe", from:"physical", to:"unsafe", beta:0.174, estimate:0.124, se:0.134, z:.924, p:.243, ci:[-0.126,0.403], interpretation:"Physical fatigue shows a positive estimated association with unsafe riding (β = 0.174), but it is not statistically significant in the final MLR model (p = .243)." },
  { id:"kurang-unsafe", from:"kurang", to:"unsafe", beta:-0.070, estimate:-0.085, se:0.288, z:-.295, p:.711, ci:[-0.677,0.452], interpretation:"Low Energy shows a small negative estimated association with unsafe riding (β = −0.070), but it is not statistically significant in the final MLR model (p = .711)." },
  { id:"prolong-unsafe", from:"prolong", to:"unsafe", beta:0.395, estimate:0.549, se:0.193, z:2.838, p:.000, ci:[0.272,1.001], interpretation:"Higher prolonged fatigue is positively associated with unsafe riding in the final MLR model (β = 0.395, p < .001). This is a modelled association, not evidence by itself of a causal mechanism." },
  { id:"motivation-unsafe", from:"motivation", to:"unsafe", beta:0.316, estimate:0.446, se:0.235, z:1.898, p:.000, ci:[0.055,0.943], interpretation:"Motivation (Faktor dorongan) shows a positive association with unsafe riding in the final MLR model (β = 0.316, p < .001). This is a modelled association, not proof of causality." },
  { id:"physical-mental", from:"physical", to:"mental", beta:-0.007, estimate:-0.007, se:0.093, z:-.075, p:.941, ci:[-0.201,0.164], interpretation:"The direct path is essentially zero in the fitted model." },
  { id:"kurang-mental", from:"kurang", to:"mental", beta:0.858, estimate:1.416, se:0.199, z:7.103, p:0.000, ci:[1.105,1.882], interpretation:"Low Energy has a strong positive standardized association with Mental Fatigue, with the CI clearly above zero." },
  { id:"prolong-mental", from:"prolong", to:"mental", beta:0.000, estimate:0.000, se:0.084, z:0, p:1, ci:[-0.162,0.172], interpretation:"The direct path is estimated at essentially zero after the other fatigue dimensions are included." },
  { id:"motivation-mental", from:"motivation", to:"mental", beta:-0.030, estimate:-0.057, se:0.096, z:-.599, p:.549, ci:[-0.251,0.125], interpretation:"The standardized association is small and negative, with the CI spanning zero." },
  { id:"kurang-physical", from:"kurang", to:"physical", beta:0.718, estimate:1.230, se:0.128, z:9.602, p:0.000, ci:[1.006,1.514], interpretation:"Low Energy is strongly and positively associated with Physical Fatigue." },
  { id:"prolong-physical", from:"prolong", to:"physical", beta:0.238, estimate:0.465, se:0.092, z:5.073, p:0.000, ci:[0.299,0.668], interpretation:"Prolonged Fatigue is positively associated with Physical Fatigue, with a CI excluding zero." },
  { id:"motivation-physical", from:"motivation", to:"physical", beta:-0.035, estimate:-0.069, se:0.095, z:-.721, p:.471, ci:[-0.259,0.117], interpretation:"The standardized association is small and negative, with the CI spanning zero." },
  { id:"prolong-kurang", from:"prolong", to:"kurang", beta:0.512, estimate:0.586, se:0.060, z:9.711, p:0.000, ci:[0.473,0.708], interpretation:"Prolonged Fatigue is positively associated with Low Energy." },
  { id:"motivation-kurang", from:"motivation", to:"kurang", beta:0.087, estimate:0.101, se:0.076, z:1.329, p:.184, ci:[-0.049,0.248], interpretation:"The direct association is small and not statistically distinguishable from zero." },
  { id:"motivation-prolong", from:"motivation", to:"prolong", beta:-0.162, estimate:-0.165, se:0.076, z:-2.174, p:.030, ci:[-0.314,-0.005], interpretation:"Higher Motivation is associated with lower Prolonged Fatigue in the fitted model; the CI narrowly excludes zero." },
];

export const covariance = {
  from: "Letih_RLR",
  to: "Letih_bwk_laju",
  estimate: 0.653,
  standardized: 0.469,
  se: 0.116,
  z: 5.626,
  p: "<.001",
  ci: [0.403, 0.859] as [number, number],
  note: "This is a residual covariance, not a causal path. Both observed indicators belong to Unsafe Riding. The supplied manuscript does not give a specific substantive rationale for this particular covariance; statistical significance alone does not establish its substantive cause.",
};

export const sequentialIndirect = {
  label: "Prolonged Fatigue → Low Energy → Mental Fatigue → Unsafe Riding",
  estimate: 0.18,
  se: 0.136,
  z: 1.329,
  p: 0.184,
  ci: [-0.033, 0.481] as [number, number],
  note: "This sequential indirect effect uses unstandardized component paths and bootstrap percentile inference (5,000 requested resamples; 4,997 successful in the source output). The CI includes zero.",
};
