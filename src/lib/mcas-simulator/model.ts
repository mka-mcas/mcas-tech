/**
 * MCAS Collision Avoidance Simulator — prototype model v0.1.
 * Synthetic point-mass model only; not a validated motorcycle dynamics model.
 * Steering is an illustrative lateral shift, not a stability-safe trajectory.
 */
export type Manoeuvre = "braking" | "steering" | "combined";
export type SimulatorInput = {
  motorcycleSpeedKmh: number; initialGapM: number; leadVehicleSpeedKmh: number;
  leadVehicleDecelMps2: number; riderReactionS: number; alertLeadTimeS: number;
  riderDecelMps2: number; roadFriction: number; manoeuvre: Manoeuvre; lateralShiftM: number;
};
export type SimPoint = { t: number; bikeX: number; leadX: number; gap: number; bikeSpeed: number; leadSpeed: number; lateralY: number; alert: "green" | "amber" | "red" };
export type SimulatorResult = {
  modelVersion: "0.1.0"; evidenceClass: "synthetic_unvalidated"; input: SimulatorInput;
  points: SimPoint[]; collision: boolean; minimumGapM: number; minimumGapTimeS: number;
  finalBikeSpeedKmh: number; alertTimeS: number; responseTimeS: number; assumptions: string[];
};
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export function simulateMcasScenario(input: SimulatorInput): SimulatorResult {
  const dt = 0.05, maxTime = 8;
  const bikeV0 = Math.max(0, input.motorcycleSpeedKmh / 3.6);
  const leadV0 = Math.max(0, input.leadVehicleSpeedKmh / 3.6);
  const alertTimeS = Math.max(0, input.alertLeadTimeS);
  const responseTimeS = alertTimeS + Math.max(0, input.riderReactionS);
  const frictionLimit = Math.max(0.1, input.roadFriction) * 9.81;
  const riderDecel = input.manoeuvre === "steering" ? 0 : clamp(input.riderDecelMps2, 0, frictionLimit);
  const leadDecel = Math.max(0, input.leadVehicleDecelMps2);
  const points: SimPoint[] = [];
  let minGap = Number.POSITIVE_INFINITY, minGapTime = 0, collision = false;
  for (let i = 0; i <= Math.round(maxTime / dt); i++) {
    const t = Number((i * dt).toFixed(2));
    const tau = Math.max(0, t - responseTimeS);
    const bikeStopTime = riderDecel > 0 ? bikeV0 / riderDecel : Number.POSITIVE_INFINITY;
    const bikeActiveTime = Math.min(tau, bikeStopTime);
    const bikeAfterResponse = bikeV0 * bikeActiveTime - 0.5 * riderDecel * bikeActiveTime ** 2;
    const bikeX = bikeV0 * Math.min(t, responseTimeS) + (t > responseTimeS ? bikeAfterResponse : 0);
    const bikeSpeed = t <= responseTimeS ? bikeV0 : Math.max(0, bikeV0 - riderDecel * tau);
    const leadStopTime = leadDecel > 0 ? leadV0 / leadDecel : Number.POSITIVE_INFINITY;
    const leadActiveTime = Math.min(t, leadStopTime);
    const leadTravel = leadV0 * leadActiveTime - 0.5 * leadDecel * leadActiveTime ** 2;
    const leadX = Math.max(0, input.initialGapM) + leadTravel;
    const leadSpeed = Math.max(0, leadV0 - leadDecel * t);
    const gap = leadX - bikeX;
    const lateralProgress = input.manoeuvre === "braking" ? 0 : clamp((t - responseTimeS) / 1.5, 0, 1);
    const lateralY = input.lateralShiftM * lateralProgress;
    const alert = t < alertTimeS ? "green" : t < alertTimeS + 0.5 ? "amber" : "red";
    points.push({ t, bikeX, leadX, gap, bikeSpeed, leadSpeed, lateralY, alert });
    if (gap < minGap) { minGap = gap; minGapTime = t; }
    if (gap <= 0) collision = true;
  }
  return {
    modelVersion: "0.1.0", evidenceClass: "synthetic_unvalidated", input, points, collision,
    minimumGapM: minGap, minimumGapTimeS: minGapTime,
    finalBikeSpeedKmh: (points[points.length - 1]?.bikeSpeed ?? 0) * 3.6, alertTimeS, responseTimeS,
    assumptions: [
      "Synthetic scenario; not derived from an observed MCAS event.",
      "One-dimensional longitudinal motion; constant rider deceleration after response.",
      "Lead vehicle follows constant deceleration until stationary.",
      "Alert time is user-specified; production MCAS alert logic is not executed.",
      "Steering is an illustrative lateral shift; no lean, tyre, yaw, or lateral-clearance physics.",
      "Collision detection uses longitudinal overlap only and does not establish real-world crash risk."
    ]
  };
}