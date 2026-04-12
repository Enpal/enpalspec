## REMOVED Requirements

### Requirement: Command execution tracking
**Reason**: enpalspec must not send usage data to openspec's PostHog pipeline. The telemetry capability is removed entirely.
**Migration**: No migration. Telemetry is gone; no replacement.

### Requirement: Privacy-preserving event design
**Reason**: No telemetry events are sent; event design requirements are moot.
**Migration**: N/A

### Requirement: Environment variable opt-out
**Reason**: No telemetry to opt out of.
**Migration**: N/A

### Requirement: CI environment auto-disable
**Reason**: No telemetry to disable.
**Migration**: N/A

### Requirement: First-run telemetry notice
**Reason**: No telemetry; no notice needed.
**Migration**: N/A

### Requirement: Anonymous user identification
**Reason**: No telemetry events to identify users for.
**Migration**: N/A

### Requirement: Immediate event sending
**Reason**: No events are sent.
**Migration**: N/A

### Requirement: Graceful shutdown
**Reason**: No PostHog client to shut down.
**Migration**: N/A

### Requirement: Silent failure handling
**Reason**: No telemetry calls that could fail.
**Migration**: N/A
