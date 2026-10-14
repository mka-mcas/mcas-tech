# MCAS Collision Avoidance Simulator — data contract v0.1

## Status
Prototype only. The current simulator runs a transparent, simplified TypeScript model in the browser. It is NOT connected to MATLAB, has not been calibrated with field measurements, and must not be described as a validated motorcycle dynamics or MCAS effectiveness model.

## Intended architecture
1. Next.js collects validated scenario parameters.
2. A versioned simulation interface accepts a typed input object.
3. A future server-side adapter calls a MATLAB-backed API when deployment/licensing is decided.
4. The UI renders returned trajectories and metrics.
5. Every result carries a model version and evidence class.

Do not expose MATLAB, Supabase, or other server credentials in browser code. Apply server-side input validation, rate limits, request timeouts, and authentication if simulations become costly or sensitive.

## Minimum event schema for future field data

### mcas_events — one row per event
- event_id (UUID/string; required)
- motorcycle_id (pseudonymous ID; required)
- event_start_utc, event_end_utc (ISO 8601 UTC timestamps)
- scenario_type (controlled vocabulary)
- outcome (collision, near_miss, avoidance, indeterminate)
- video_uri (optional protected reference; do not put raw video in a database row)
- annotation_status, data_quality_status
- protocol_version and consent_status as required by the approved study protocol

### mcas_timeseries — one row per sample
- event_id, timestamp_utc or timestamp_ms from a documented shared clock
- source_sensor, source_sample_id (when available)
- lidar_distance_m
- motorcycle_speed_mps
- gps_lat, gps_lon, gps_accuracy_m
- heading_deg
- accel_long_mps2, accel_lat_mps2, yaw_rate_dps
- brake_input / brake_pressure (state exactly what the hardware measures)
- steering_input_deg, lean_angle_deg (only if measured)
- mcas_alert_state and alert-transition event timestamp

Sensor-specific sampling rates, calibration, units, clock offset, dropped-sample counts and firmware version must be stored in metadata. Do not fabricate missing values.

### mcas_event_annotations — reviewed interpretations
- event_id, annotator_id (pseudonymised)
- brake_onset_ms, steer_onset_ms
- manoeuvre_type
- minimum_clearance_m and method used to estimate it
- outcome, confidence, notes

### mcas_vehicle_config — versioned configuration
- motorcycle make/model or anonymised class
- total mass with rider, wheelbase and available geometry
- tyre and brake configuration
- measured/specified/assumed parameter provenance
- configuration effective dates

## Simulator input v0.1
- motorcycleSpeedKmh
- initialGapM
- leadVehicleSpeedKmh
- leadVehicleDecelMps2
- riderReactionS
- alertLeadTimeS
- riderDecelMps2
- roadFriction
- manoeuvre
- lateralShiftM

All inputs need finite-number checks and bounded ranges on the server. This schema is a prototype contract, not the final scientific protocol.

## Simulator result v0.1
- modelVersion
- evidenceClass (synthetic_unvalidated; later potentially calibrated or validated under defined acceptance criteria)
- echoed input
- time-series points with position, speed, gap, lateral illustration and alert state
- minimum longitudinal gap and time
- collision flag based on longitudinal overlap only
- assumptions and limitations

The current collision output means only longitudinal overlap under the simplified equations. It is not a 2D collision determination and does not account for lean, tyre forces, rider balance, lateral clearance, or realistic motorcycle stability.

## Validation plan
1. Unit-test equations, units, bounds and edge cases.
2. Verify deterministic outputs for a fixed input and model version.
3. Compare against analytical stopping-distance checks.
4. With field data, synchronize sensor and video timelines and assess sensor quality.
5. Calibrate only against a designated training subset.
6. Evaluate on separate held-out events and report errors/uncertainty.
7. Use validated only after pre-specified acceptance criteria and appropriate expert review.

## Research and safety guardrails
- Label all synthetic outputs prominently.
- Never present synthetic results as recorded events or crash-reduction estimates.
- Do not use this prototype for rider instruction, safety-critical decisions, or public claims of MCAS effectiveness.
- Keep raw observations immutable; store derived annotations and simulation runs separately.
- Use consent, access controls, retention limits and location/video privacy safeguards for field data.