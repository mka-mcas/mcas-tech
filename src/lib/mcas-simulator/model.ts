/**
 * MCAS Collision Avoidance Simulator — prototype model v0.1
 *
 * Transparent point-mass, longitudinal model for synthetic scenario exploration.
 * NOT a validated motorcycle dynamics model. Steering is represented only as an
 * idealised lateral displacement and must not be interpreted as stability-safe.
 * Keep this deterministic function pure so it can later be mirrored by MATLAB.
 */

export type Manoeuvre = "braking" | "steering" | "combined";

export type SimulatorInput = {
  motorcycleSpeedKmh: number;
  initialGapM: number;
  leadVehicleSpeedKmh: number;
  leadVehicleDecelMps2: number;
  riderReactionS: number;
  alertLeadTimeS: number;
  riderDecelMps2: number;
  roadFriction: number;
  manoeuvre: Manoeuvre;
  lateralShiftM: number;
};

export type SimPoint = {
  t: number;
  bikeX: number;
  leadX: number;
  gap: number;
  bikeSpeed: number;
  leadSpeed: number;
  lateralY: number;
  alert: "green" | "amber" | "red";
};

export type SimulatorResult = {
  modelVersion: "0.1.0";
  evidenceClass: "synthetic_unvalidated";
  input: SimulatorInput;
  points: SimPoint[];
  collision: boolean;
  minimumGapM: number;
  minimumGapTimeS: number;
  finalBikeSpeedKmh: number;
  alertTimeS: number;
  responseTimeS: number;
  assumptions: string[];
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function simulateMcasScenario(input: SimulatorInput): SimulatorResult {
  const dt = 0.05;
  const maxTime = 8;
  const bikeV0 = input.motorcycleSpeedKmh / 3.6;
  const leadV0 = input.leadVehicleSpeedKmh / 3.6;
  const alertTimeS = Math.max(0, input.alertLeadTimeS);
  const responseTimeS = alertTimeS + Math.max(0, input.riderReactionS);
  const frictionLimit = Math.max(0.1, input.roadFriction) * 9.81;
  const riderDecel = input.manoeuvre === "steering" ? 0 : Math.min(input.riderDecelMps2, frictionLimit);
  const leadDecel = Math.max(0, input.leadVehicleDecelMps2);
  const points: SimPoint[] = [];
  let minGap = Number.POSITIVE_INFINITY;
  let minGapTime = 0;
  let collision = false;

  for (let t = 0; t <= maxTime + 1e-9; t += dt) {
    const elapsedBikeResponse = Math.max(0, t - responseTimeS);
    const bikeDecelDistance = Math.min(bikeV0 * elapsedBikeResponse, 0.5 * riderDecel * elapsedBikeResponse ** 2);
    const bikeSpeed = Math.max(0, bikeV0 - riderDecel * elapsedBikeResponse);
    const bikeX = bikeV0 * Math.min(t, responseTimeS) +
      (t > responseTimeS ? bikeV0 * elapsedBikeResponse - bikeDecelDistance : 0);

    const leadMovingTime = t;
    const leadSpeed = Math.max(0, leadV0 - leadDecel * leadMovingTime);
    const leadTravel = leadV0 * Math.min(t, leadV0 / Math.max(leadDecel, 1e-9)) -
      0.5 * leadDecel * Math.min(t, leadV0 / Math.max(leadDecel, 1e-9)) ** 2;
    const leadX = input.initialGapM + leadTravel;
    const gap = leadX - bikeX;
    const lateralProgress = input.manoeuvre === "braking" ? 0 : clamp((t - responseTimeS) / 1.5, 0, 1);
    const lateralY = input.lateralShiftM * lateralProgress;
    const alert = t < alertTimeS ? "green" : t < alertTimeS + 0.5 ? "amber" : "red";

    points.push({ t: Number(t.toFixed(2)), bikeX, leadX, gap, bikeSpeed, leadSpeed, lateralY, alert });
    if (gap < minGap) {
      minGap = gap;
      minGapTime = t;
    }
    // Collision classification is longitudinal only; steering clearance is not modelled.
    if (gap <= 0) collision = true;
  }

  return {
    modelVersion: "0.1.0",
    evidenceClass: "synthetic_unvalidated",
    input,
    points,
    collision,
    minimumGapM: minGap,
    minimumGapTimeS: minGapTime,
    finalBikeSpeedKmh: (points[points.length - 1]?.bikeSpeed ?? 0) * 3.6,
    alertTimeS,
    responseTimeS,
    assumptions: [
      "Synthetic scenario; not derived from an observed MCAS event.",
      "One-dimensional longitudinal motion with constant rider deceleration after response.",
      "Lead vehicle follows constant deceleration until stationary.",
      "Alert timing is user-specified; the real MCAS alert algorithm is not executed here.",
      "Steering is a visualised lateral shift only; no motorcycle lean, tyre, yaw, or lateral-clearance physics.",
      "Collision detection uses longitudinal overlap only and does not establish real-world crash risk."
    ]
  };
}
