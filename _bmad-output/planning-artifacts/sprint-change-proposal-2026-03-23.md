# Sprint Change Proposal

**Project:** tomcoldenhoff.com  
**Date:** 2026-03-23  
**Prepared By:** Scrum Master Change Navigation Workflow  
**Mode:** Batch

**Approval:** Approved by Tom on 2026-03-23 for implementation.

**Applied changes (post-approval):**
- Updated `epics.md` with per-story `**Implements:**` lines, expanded failure-path acceptance criteria on targeted stories, refreshed UX requirements section and `inputDocuments`.
- Updated `prd.md` with story-level FR traceability governance bullet.
- Updated `architecture.md` Implementation Handoff with companion `ux-design.md` expectation.
- Added `ux-design.md` lightweight UX specification.

## Section 1: Issue Summary

### Triggering Context

- Trigger source: Implementation readiness assessment (`implementation-readiness-report-2026-03-23.md`)
- Triggering scope: Cross-cutting planning quality gaps affecting implementation readiness
- Triggering story: No single story defect; this is a plan-quality trigger discovered pre-implementation

### Core Problem Statement

The current planning artifacts are structurally strong and fully FR-covered, but not yet implementation-ready at execution granularity due to three gaps:

1. Story-level FR traceability is missing inside individual story blocks.
2. Several stories do not include explicit error/failure-path acceptance criteria.
3. UX is clearly implied by PRD/architecture but no standalone UX design artifact exists.

### Evidence

- Readiness status was assessed as **NEEDS WORK**.
- Epics coverage is 100%, but traceability is centralized only in the FR map section.
- UX warning explicitly flags missing UX document for a user-facing web application.
- Multiple operational stories are primarily happy-path oriented.

## Section 2: Impact Analysis

### Epic Impact

- Affected epics: **All 6 epics**
- Type of impact:
  - Add per-story FR references (`Implements: FRx...`)
  - Add error/failure-path ACs where relevant
- Structural impact:
  - No epic reorder required
  - No epic deletion required
  - No new implementation epic required

### Story Impact

- Stories requiring updates: all stories for traceability consistency
- Stories requiring stronger failure-path ACs (high priority):
  - `1.2`, `1.3`, `1.4`
  - `2.2`, `2.3`
  - `4.2`, `4.3`, `4.4`, `4.5`
  - `5.1`, `5.2`, `5.4`
  - `6.2`, `6.4`

### Artifact Conflicts / Required Updates

- `epics.md`:
  - Add story-level FR references
  - Add explicit failure-path ACs
- `prd.md`:
  - No mandatory requirement changes
  - Optional clarification: add implementation traceability convention note
- `architecture.md`:
  - No core architecture decision changes
  - Optional addition: reference UX spec as required companion artifact for implementation
- UX artifact:
  - Add new lightweight UX spec file to planning artifacts

### Technical and Delivery Impact

- Timeline impact: **Low to Medium** (documentation-level changes)
- Technical risk if not addressed: **Medium**
- Operational risk if not addressed: **Medium** (ambiguous implementation interpretation, rework risk)

## Section 3: Recommended Approach

### Option Evaluation

1. **Option 1 - Direct Adjustment**: **Viable**
   - Effort: Low-Medium
   - Risk: Low-Medium
   - Rationale: Gaps are documentation and acceptance-quality issues; can be resolved without rollback or MVP reset.

2. **Option 2 - Potential Rollback**: **Not viable**
   - Effort: High
   - Risk: Medium
   - Rationale: No implementation has been executed yet; rollback adds no value.

3. **Option 3 - PRD MVP Review**: **Partially viable but unnecessary as primary path**
   - Effort: Medium
   - Risk: Low
   - Rationale: MVP scope is not fundamentally broken; only execution-readiness fidelity needs improvement.

### Selected Approach

**Selected path: Option 1 (Direct Adjustment) with a lightweight UX artifact addition.**

### Why This Path

- Preserves existing solid structure (100% FR coverage, good epic sequencing).
- Fixes highest-value readiness defects quickly.
- Minimizes disruption and keeps momentum toward sprint planning.

## Section 4: Detailed Change Proposals

### 4.1 Stories (`epics.md`)

#### Change A: Add explicit story-level FR traceability line

Story: Global pattern across all stories  
Section: Each story block (after story statement, before ACs)

OLD:
```md
### Story 1.2: Configure Deterministic GitHub Pages Build and Deploy Pipeline

As a solo publisher,
I want repository changes to trigger deterministic static build and deployment to GitHub Pages,
So that publishing is repeatable and reliable.

**Acceptance Criteria:**
```

NEW:
```md
### Story 1.2: Configure Deterministic GitHub Pages Build and Deploy Pipeline

As a solo publisher,
I want repository changes to trigger deterministic static build and deployment to GitHub Pages,
So that publishing is repeatable and reliable.

**Implements:** FR3, FR28

**Acceptance Criteria:**
```

Rationale: Enables direct requirement traceability during implementation and QA.

---

#### Change B: Add explicit failure/error-path ACs to operational stories

Story: 1.2 (example)  
Section: Acceptance Criteria

OLD:
```md
**Given** a commit to `main`
**When** CI runs
**Then** validation and build steps execute before deploy
**And** deployment is blocked if validation/build fails
```

NEW:
```md
**Given** a commit to `main`
**When** CI runs
**Then** validation and build steps execute before deploy
**And** deployment is blocked if validation/build fails

**Given** the CI workflow configuration is invalid or a required step errors
**When** pipeline execution fails
**Then** deploy is skipped
**And** failure output identifies the failed step and remediation hint
```

Rationale: Converts implied failure behavior into explicit testable criteria.

---

#### Change C: Apply same failure-path enhancement pattern to targeted stories

Stories to update:
- 1.3, 1.4
- 2.2, 2.3
- 4.2, 4.3, 4.4, 4.5
- 5.1, 5.2, 5.4
- 6.2, 6.4

Rationale: Consistent execution safety, clearer QA expectations, reduced ambiguity.

### 4.2 PRD (`prd.md`)

#### Change D: Optional traceability guidance note (non-blocking)

Section: Implementation considerations or delivery governance note

OLD:
```md
- Validate SEO/performance/accessibility/analytics at launch and during each post release cycle.
```

NEW:
```md
- Validate SEO/performance/accessibility/analytics at launch and during each post release cycle.
- Maintain story-level requirement traceability in implementation artifacts (each story references implemented FR IDs).
```

Rationale: Keeps planning/implementation governance explicit.

### 4.3 Architecture (`architecture.md`)

#### Change E: Add UX companion-artifact expectation (non-breaking)

Section: Implementation readiness / handoff notes

OLD:
```md
No explicit UX companion artifact requirement.
```

NEW:
```md
For user-facing features, maintain a lightweight UX specification (navigation behavior, responsive rules, interaction/accessibility patterns) as a companion planning artifact.
```

Rationale: Aligns architecture handoff with practical UX implementation needs.

### 4.4 UX Artifact (new)

#### Change F: Create lightweight UX specification file

New file proposed:
- `/_bmad-output/planning-artifacts/ux-design.md`

Proposed contents:
- Information architecture and nav model
- Home/post/taxonomy/about page behavior
- Responsive breakpoints and readability rules
- Interaction patterns (states, errors, loading)
- Accessibility checklist aligned to PRD NFR10/NFR11 + FR34-FR37

Rationale: Closes readiness warning while keeping scope lean.

## Section 5: Implementation Handoff

### Scope Classification

**Moderate**

- Reason: Multiple artifacts need coordinated updates, but no fundamental replan is required.

### Handoff Recipients and Responsibilities

- **Product Owner / Scrum Master**
  - Apply `epics.md` story traceability and AC enhancements.
  - Ensure backlog items reflect revised story definitions.
- **UX Designer (or PM acting in UX role)**
  - Draft lightweight `ux-design.md` aligned with current PRD/architecture.
- **Architect (light touch)**
  - Review architecture note update for UX companion-artifact alignment.
- **Development Team**
  - Implement only after revised artifacts are approved and sprint planning is regenerated.

### Success Criteria

1. Every story in `epics.md` includes explicit `Implements: FR...`.
2. Targeted stories include at least one explicit failure/error-path AC.
3. `ux-design.md` exists and aligns with PRD + architecture constraints.
4. Readiness workflow rerun returns **READY** or equivalent with no major issues.

## Checklist Status Snapshot

- 1.1 Trigger identified: [x] Done
- 1.2 Core problem defined: [x] Done
- 1.3 Evidence collected: [x] Done
- 2.1-2.5 Epic impact assessed: [x] Done
- 3.1-3.4 Artifact conflict analysis: [x] Done
- 4.1-4.4 Path forward evaluated and selected: [x] Done
- 5.1-5.5 Proposal components completed: [x] Done
- 6.1/6.2 Final review and proposal quality: [x] Done
- 6.3 Approval pending: [!] Action-needed
- 6.4 sprint-status.yaml update: [N/A] Skip (no sprint status file in current artifacts)
- 6.5 Final handoff confirmation pending approval: [!] Action-needed
