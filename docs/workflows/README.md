# Workflow Diagrams

This folder stores Mermaid source diagrams (`.mmd`).

PNG diagrams are generated from the Mermaid source by GitHub Actions workflow:

```text
.github/workflows/render-mermaid-png.yml
```

Expected generated files:

```text
docs/workflows/01_end_to_end_workflow.png
docs/workflows/02_metadata_scanner_workflow.png
docs/workflows/03_merge_gold_builder_workflow.png
docs/workflows/04_operations_retention_workflow.png
```

If GitHub Actions is disabled, render manually with Mermaid CLI:

```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i docs/workflows/01_end_to_end_workflow.mmd -o docs/workflows/01_end_to_end_workflow.png
```
