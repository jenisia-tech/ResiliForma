import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=60, bottom=60, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_sih_proposal(target_path="/Users/Chris David/Documents/SIH/SIH Project Proposal.docx"):
    doc = docx.Document()

    # Standard A4 Margins
    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.85)
        s.right_margin = Inches(0.85)

    NAVY = RGBColor(15, 23, 42)          # #0F172A
    TEAL = RGBColor(14, 116, 144)        # #0E7490 (Cyan/Teal Accent)
    DARK_TEXT = RGBColor(30, 41, 59)     # #1E293B
    MUTED_TEXT = RGBColor(100, 116, 139) # #64748B

    # Base Normal Style
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Calibri'
    style_normal.font.size = Pt(10)
    style_normal.font.color.rgb = DARK_TEXT
    style_normal.paragraph_format.line_spacing = 1.15
    style_normal.paragraph_format.space_after = Pt(4)

    # Document Header
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(2)
    p_title.paragraph_format.space_before = Pt(0)
    
    r_sub = p_title.add_run("SMART INDIA HACKATHON 2026 — TECHNICAL PROPOSAL & REPORT\n")
    r_sub.font.size = Pt(11)
    r_sub.font.bold = True
    r_sub.font.color.rgb = TEAL

    r_main = p_title.add_run("ResiliForma: A Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma")
    r_main.font.size = Pt(15)
    r_main.font.bold = True
    r_main.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(8)
    r_tag = p_sub.add_run("Early-Stage Multi-Hazard Decision Support Co-Pilot for Sustainable Smart City Site Planning (SIH26114)")
    r_tag.font.size = Pt(9.5)
    r_tag.font.italic = True
    r_tag.font.color.rgb = MUTED_TEXT

    # Metadata Table
    meta_table = doc.add_table(rows=11, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(meta_table, color="CBD5E1")

    meta_data = [
        ("Problem Statement ID:", "SIH26114"),
        ("Problem Statement Title:", "Smart City Site Planning using Autodesk Forma Site Design"),
        ("Theme / Category:", "Software / Miscellaneous (Urban & Rural Spatial Planning, Multi-Hazard Screening)"),
        ("Target Organization:", "Autodesk"),
        ("Project Title:", "ResiliForma: Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma"),
        ("Core Architecture:", "React 18/TypeScript Dashboard + FastAPI Deterministic Heuristic Engine + Forma Adapter"),
        ("Benchmark Demonstration Site:", "Karunya Nagar Smart City Sector (1.2 km² / 120 ha), Coimbatore South, Tamil Nadu"),
        ("Team Name / ID:", "ResiliForma"),
        ("Team Leader:", "Chris David Raj A (Computer Science & Engineering)"),
        ("Team Members:", "Jenisia Mary, Harry Joseph, Chandy N Jomon, Jeffrey, Kenrich Gladson"),
        ("Institution:", "Karunya Institute of Technology and Sciences, Coimbatore, Tamil Nadu")
    ]

    col_widths = [Inches(2.3), Inches(4.4)]
    for r_idx, (k, v) in enumerate(meta_data):
        row = meta_table.rows[r_idx]
        for c_idx, text in enumerate([k, v]):
            cell = row.cells[c_idx]
            cell.width = col_widths[c_idx]
            set_cell_margins(cell, top=50, bottom=50, left=90, right=90)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.1
            run = p.add_run(text)
            if c_idx == 0:
                run.font.bold = True
                run.font.size = Pt(9)
                run.font.color.rgb = NAVY
                set_cell_background(cell, "F1F5F9")
            else:
                run.font.size = Pt(9)
                run.font.color.rgb = DARK_TEXT
                set_cell_background(cell, "FFFFFF" if r_idx % 2 == 0 else "F8FAFC")

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(9)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.size = Pt(10.5)
        run.font.bold = True
        run.font.color.rgb = TEAL
        return p

    def add_bullet(p_bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.15
        r1 = p.add_run(p_bold_prefix)
        r1.font.bold = True
        r1.font.color.rgb = NAVY
        r2 = p.add_run(" " + text)
        r2.font.color.rgb = DARK_TEXT
        return p

    # 1. ABSTRACT
    add_h1("1. Abstract")
    doc.add_paragraph(
        "Urban site planning requires designers to make decisions about buildings, roads, landscaping, environmental conditions, and infrastructure "
        "before detailed engineering begins. During this early conceptual design stage, a small change in building orientation, landscape buffering, "
        "or stormwater infrastructure can significantly affect the environmental resilience and lifecycle performance of a proposed site. "
        "ResiliForma is an early-stage deterministic multi-hazard screening extension designed to work alongside Autodesk Forma Site Design (SIH26114). "
        "It provides rapid, transparent screening of three critical environmental hazards: road traffic noise, direct solar façade exposure, and stormwater runoff."
    )
    doc.add_paragraph(
        "The primary site model is authored in Autodesk Forma Site Design. ResiliForma then provides a supplementary analytical layer that allows "
        "urban planners to evaluate environmental trade-offs interactively. The system compares a conventional Baseline Proposal with an optimized "
        "Resilient Proposal, calculating a transparent composite resilience score. Built using React, TypeScript, and a FastAPI backend, the prototype "
        "evaluates a 1.2 km² (120 ha) demonstration site in Karunya Nagar, Coimbatore South. On this benchmark parcel (26 building blocks adjacent to the "
        "NH-544 / Siruvani Road corridor), the Baseline Proposal achieves a screening score of 48/100 (Grade D), while the Resilient Proposal reaches "
        "87/100 (Grade A, +39 point improvement) through a -18° orientation offset, 3.5m acoustic berm, 8m native vegetative buffer, 1.2m shading louvers, "
        "644m of bioswales, and 7,800 m³ of retention storage. ResiliForma does not replace Autodesk Forma's native analyses; rather, it provides instant "
        "deterministic screening to guide early design decisions before full engineering simulation."
    )

    # 2. SCOPE AND PLATFORM POSITIONING (MANDATORY COMPLIANCE)
    add_h1("2. Scope, Boundaries & Autodesk Forma Positioning")
    doc.add_paragraph(
        "ResiliForma strictly adheres to the core architecture and problem guidelines of SIH26114:"
    )
    add_bullet("Autodesk Forma as Primary Platform:",
               "Autodesk Forma Site Design remains the authoritative platform for site modeling, 3D building massing, terrain grading, and native cloud analyses. ResiliForma does not clone, replace, or imitate Autodesk Forma.")
    add_bullet("ResiliForma as Supplementary Screening Extension:",
               "ResiliForma operates as a supplementary decision-support co-pilot, applying deterministic equations to normalized site parameters to provide instant screening feedback.")
    add_bullet("Acoustic Model Boundaries:",
               "Provides geometric barrier diffraction and vegetative attenuation estimates (ISO 9613-2 inspired). It does not replace full 3D wave ray-tracing or statutory acoustic compliance modeling.")
    add_bullet("Solar Model Boundaries:",
               "Estimates peak direct façade irradiance reduction from building orientation and external louvers. Whole-building thermal/HVAC simulations remain verified in Autodesk Forma, Revit, and EnergyPlus.")
    add_bullet("Stormwater Model Boundaries:",
               "Applies the Rational Method for peak runoff screening and SuDS retention volume calculation. It does not replace 2D hydrodynamic flood simulations (such as EPA SWMM or HEC-RAS).")
    add_bullet("Forma Native Analysis Verification:",
               "Forma native analyses (Area Metrics, Embodied Carbon, Sun Hours, Daylight Potential, Wind, Microclimate, Noise, Solar Energy) are tracked in an extension verification checklist, preserving Autodesk's authoritative toolchain.")

    # 3. THE PROBLEM & EXISTING LANDSCAPE
    add_h1("3. Problem Definition & Market Landscape")
    add_h2("3.1. Problem Definition")
    doc.add_paragraph(
        "Early-stage site planning in rapid Indian urban corridors faces severe environmental vulnerabilities:"
    )
    add_bullet("1. Road Traffic Noise Pollution:",
               "Highways like NH-544 expose adjacent frontage parcels to 78–82 dBA baseline traffic noise, exceeding residential limits (55 dBA) and compromising occupant well-being.")
    add_bullet("2. Façade Solar Heat Load:",
               "Sub-optimal western façade orientations expose extensive building surfaces to severe peak afternoon radiation (>700 W/m²), drastically increasing cooling energy demand.")
    add_bullet("3. Stormwater Runoff Inundation:",
               "Urban hardscapes with high runoff coefficients (C=0.85) overwhelm storm drainage during heavy monsoon rainfall, causing flash flooding without dedicated retention.")
    add_bullet("4. The Early-Stage Feedback Gap:",
               "High-fidelity physics simulations require hours or days of CAD preparation. Consequently, building masses and zoning are locked in before environmental impacts are understood.")

    add_h2("3.2. Comparative Landscape")
    
    # Table 1: National & Global Comparison
    p_t1 = doc.add_paragraph()
    p_t1.paragraph_format.space_before = Pt(4)
    p_t1.paragraph_format.space_after = Pt(2)
    r = p_t1.add_run("Table 1: Competitive Landscape & Benchmark Comparison")
    r.font.bold = True
    r.font.size = Pt(9)
    r.font.color.rgb = TEAL

    t1 = doc.add_table(rows=5, cols=4)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t1)
    t1_headers = ["Existing Platform", "Primary Capability", "Key Strength", "Gap Addressed by ResiliForma"]
    t1_rows = [
        ("Autodesk Forma (Native Suite)", "Cloud-based conceptual site design & daylight/sun hours.", "Fast 3D massing and direct Revit interoperability.", "ResiliForma adds rapid multi-hazard screening for road noise berms & SuDS stormwater."),
        ("ISRO Bhuvan / National GIS", "2D satellite GIS mapping & land-use cadastral data.", "Authoritative national coverage and regional scale.", "Static 2D layers; lacks 3D parcel massing interaction and interactive hazard screening."),
        ("SimScale / Ladybug Tools", "High-fidelity FEM/CFD physics and annual Radiance simulations.", "High numerical precision for detailed design phases.", "High computational overhead; unsuitable for instant sub-second early sketching feedback."),
        ("Manual Consultant Workflows", "Post-design statutory compliance checklists (GRIHA/NBC 2016).", "Legally aligned with national construction codes.", "Multi-week review cycles; cannot guide real-time conceptual parameter trade-offs.")
    ]
    for c_i, h_text in enumerate(t1_headers):
        cell = t1.rows[0].cells[c_i]
        set_cell_margins(cell, top=50, bottom=50, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = NAVY
        set_cell_background(cell, "E2E8F0")

    for r_i, (col0, col1, col2, col3) in enumerate(t1_rows):
        row = t1.rows[r_i + 1]
        for c_i, val in enumerate([col0, col1, col2, col3]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=45, bottom=45, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            run.font.color.rgb = DARK_TEXT
            set_cell_background(cell, "FFFFFF" if r_i % 2 == 0 else "F8FAFC")

    # 4. DEMONSTRATION SITE & PROPOSALS
    add_h1("4. Demonstration Site & Design Proposals")
    add_h2("4.1. Demonstration Site: Karunya Nagar Smart City Sector")
    doc.add_paragraph(
        "The demonstration site selected for SIH26114 represents a realistic smart city expansion parcel located at Coimbatore South, Tamil Nadu, India (10.9366° N, 76.7441° E). "
        "The site covers exactly 1.2 km² (120 hectares / 1,200,000 m²), exceeding the SIH minimum 1.0 km² requirement. The sector includes 26 building blocks, internal arterial roads, "
        "pedestrian zones, and borders the high-traffic NH-544 / Siruvani Road transit corridor in the Western Ghats foothill monsoon environment."
    )

    add_h2("4.2. Baseline vs. Resilient Proposal Matrix")
    
    # Table 2: Proposal Comparison
    p_t2 = doc.add_paragraph()
    p_t2.paragraph_format.space_before = Pt(4)
    p_t2.paragraph_format.space_after = Pt(2)
    r = p_t2.add_run("Table 2: Demonstration Proposal Comparison Matrix")
    r.font.bold = True
    r.font.size = Pt(9)
    r.font.color.rgb = TEAL

    t2 = doc.add_table(rows=10, cols=4)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t2)
    t2_headers = ["Parameter / Metric", "Baseline Proposal (Conventional)", "Resilient Proposal (Optimized)", "Resilience Improvement"]
    t2_rows = [
        ("Façade Orientation (θ)", "0° (Direct West Facing)", "-18° (Deflected Solar Azimuth)", "18° Azimuth Deflection"),
        ("Acoustic Earth Berm (h_b)", "0.0 m (No dedicated barrier)", "3.5 m (Engineered Earth Berm)", "+3.5 m Physical Barrier"),
        ("Vegetation Buffer Depth (d_v)", "0.0 m (Paved hardscape frontage)", "8.0 m (Dense Native Planting)", "+8.0 m Acoustic Tree Buffer"),
        ("Solar Shading Louvers (d_l)", "0.0 m (Unshaded glazing)", "1.2 m (Horizontal Overhangs)", "+1.2 m Façade Shading"),
        ("SuDS Drainage Infrastructure", "0 m Swales / 0 m³ Retention Basin", "644 m Bioswales / 7,800 m³ Pond", "Integrated SuDS Network"),
        ("Road Traffic Noise Level", "78.0 dBA (High Exposure)", "62.94 dBA (~63 dBA, Improved Exposure)", "-15.05 dB Total Attenuation"),
        ("Peak Façade Solar Irradiance", "710.0 W/m² (Severe Heat Load)", "482.8 W/m² (~480 W/m², Relieved)", "-32.0% Solar Reduction"),
        ("Stormwater Runoff Management", "10.0% (Severe Runoff Risk)", "82.0% (High Infiltration & Retention)", "+72.0% Retention Efficiency"),
        ("Composite Resilience Score", "48 / 100 (Grade D — Vulnerable)", "87 / 100 (Grade A — Resilient)", "+39 Point Improvement")
    ]
    for c_i, h_text in enumerate(t2_headers):
        cell = t2.rows[0].cells[c_i]
        set_cell_margins(cell, top=50, bottom=50, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = NAVY
        set_cell_background(cell, "E2E8F0")

    for r_i, (col0, col1, col2, col3) in enumerate(t2_rows):
        row = t2.rows[r_i + 1]
        for c_i, val in enumerate([col0, col1, col2, col3]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=45, bottom=45, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if c_i == 3 or (r_i == 8 and c_i == 2):
                run.font.bold = True
                run.font.color.rgb = RGBColor(16, 185, 129)
            elif r_i == 8 and c_i == 1:
                run.font.bold = True
                run.font.color.rgb = RGBColor(239, 68, 68)
            else:
                run.font.color.rgb = DARK_TEXT
            set_cell_background(cell, "FFFFFF" if r_i % 2 == 0 else "F8FAFC")

    # 5. MATHEMATICAL SCREENING CALCULATIONS
    add_h1("5. Mathematical Screening Formulations")
    doc.add_paragraph(
        "All calculations in ResiliForma are deterministic, reproducible, and executed by modular Python microservices without black-box randomization:"
    )

    add_h2("5.1. Road Traffic Noise Screening Engine")
    doc.add_paragraph(
        "The acoustic screening model estimates total insertion loss from physical earth berm barriers and vegetative buffer zones:"
    )
    doc.add_paragraph("Optimized Noise Level (dBA) = Baseline Noise - A_barrier - A_vegetation", style='Normal')
    add_bullet("Barrier Diffraction Attenuation:", "A_barrier = min(18.0, barrier_height × 3.1) [dB]. For a 3.5m berm: A_barrier = 10.85 dB.")
    add_bullet("Vegetative Buffer Attenuation:", "A_vegetation = min(8.0, (vegetation_depth / 8.0) × 4.2) [dB]. For an 8m dense buffer: A_vegetation = 4.20 dB.")
    add_bullet("Combined Attenuation:", "Total Reduction = 10.85 + 4.20 = 15.05 dB (~15 dB). Reducing baseline 78 dBA to 62.94 dBA (~63 dBA, Improved Exposure).")

    add_h2("5.2. Solar Façade Irradiance Screening Engine")
    doc.add_paragraph(
        "The solar module calculates peak direct façade solar irradiance relief combining building azimuth offset and horizontal louver depth:"
    )
    doc.add_paragraph("Total Façade Reduction % = min(45.0, Orientation Relief + Louver Relief)", style='Normal')
    add_bullet("Orientation Relief %:", "Orientation Relief = min(25.0, |θ_offset| × 0.45 + 12.0) if θ != 0 else 0.0. For θ = -18°: Relief = 20.1%.")
    add_bullet("Louver Shading Relief %:", "Louver Relief = min(20.0, (d_louver / 1.2) × 11.9) if d_louver > 0 else 0.0. For d = 1.2m: Relief = 11.9%.")
    add_bullet("Estimated Peak Irradiance:", "Total Reduction = min(45.0, 20.1 + 11.9) = 32.0%. Final Irradiance = 710 × (1 - 0.32) = 482.8 W/m² (~480 W/m²).")

    add_h2("5.3. Stormwater Runoff (Rational Method & SuDS) Engine")
    doc.add_paragraph(
        "Stormwater peak discharge is calculated using the standard Rational Method:"
    )
    doc.add_paragraph("Q_peak (m³/s) = 0.278 × C × I × A", style='Normal')
    add_bullet("Parameters:", "C = 0.85 (impervious hardscape), I = 65 mm/hr (monsoon storm design), A = 21.04 ha = 0.2104 km².")
    add_bullet("Peak Runoff:", "Q_peak = 0.278 × 0.85 × 65 × 0.2104 = 3.23 m³/s. 1-Hour Storm Volume = 11,627 m³.")
    add_bullet("Runoff Management Score:", "Calculated deterministically from bioswale length (644m) and retention capacity (7,800 m³), achieving 82.0% retention efficiency.")

    add_h2("5.4. Composite Resilience Scoring Formulation")
    doc.add_paragraph(
        "The composite resilience score is a deterministic weighted index aggregating 5 performance categories (Weights sum to 1.00):"
    )
    add_bullet("Noise Attenuation (w = 0.30):", "Evaluates façade noise level relative to acoustic comfort thresholds.")
    add_bullet("Solar Façade Relief (w = 0.25):", "Evaluates percentage irradiance reduction and envelope thermal relief.")
    add_bullet("Stormwater Management (w = 0.25):", "Evaluates runoff volume retention and SuDS capacity.")
    add_bullet("Pedestrian Accessibility (w = 0.10):", "Evaluates walkable quiet corridors buffered from traffic.")
    add_bullet("Green Infrastructure (w = 0.10):", "Evaluates multi-functional vegetated swales and basin land efficiency.")

    # 6. SYSTEM ARCHITECTURE & IMPLEMENTATION
    add_h1("6. Technical Architecture & Implementation")
    doc.add_paragraph(
        "ResiliForma is implemented using a high-performance modular full-stack architecture:"
    )

    # Table 3: Tech Stack
    p_t3 = doc.add_paragraph()
    p_t3.paragraph_format.space_before = Pt(4)
    p_t3.paragraph_format.space_after = Pt(2)
    r = p_t3.add_run("Table 3: Software Technology Stack & Architecture")
    r.font.bold = True
    r.font.size = Pt(9)
    r.font.color.rgb = TEAL

    t3 = doc.add_table(rows=6, cols=3)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t3)
    t3_headers = ["Layer / Module", "Technology Platform", "Implemented Functionality"]
    t3_rows = [
        ("Primary CAD Host", "Autodesk Forma Site Design", "3D building massing, terrain grading, and native cloud analyses."),
        ("Integration Adapter", "TypeScript IFormaAdapter", "Normalized site context extraction and iframe extension handshake."),
        ("Frontend Dashboard", "React 18, TypeScript, Vite, CSS", "Interactive 2.5D SVG spatial canvas, live sliders, and comparison tables."),
        ("Backend Solver", "Python 3.11, FastAPI, Pydantic v2", "Asynchronous REST API executing deterministic screening calculations."),
        ("Verification & Testing", "Pytest, HTTPX, TypeScript Compiler", "15 automated unit and API integration tests ensuring formula validity.")
    ]
    for c_i, h_text in enumerate(t3_headers):
        cell = t3.rows[0].cells[c_i]
        set_cell_margins(cell, top=50, bottom=50, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = NAVY
        set_cell_background(cell, "E2E8F0")

    for r_i, (col0, col1, col2) in enumerate(t3_rows):
        row = t3.rows[r_i + 1]
        for c_i, val in enumerate([col0, col1, col2]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=45, bottom=45, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            run.font.color.rgb = DARK_TEXT
            set_cell_background(cell, "FFFFFF" if r_i % 2 == 0 else "F8FAFC")

    # 7. WORKFLOW & FORMA INTEGRATION
    add_h1("7. User Workflow & Autodesk Forma Extension Pipeline")
    doc.add_paragraph(
        "The end-to-end planning workflow follows a structured 7-step decision pipeline:"
    )
    add_bullet("Step 1 (Author in Forma):", "The urban planner designs building massing, roads, and open spaces in Autodesk Forma Site Design.")
    add_bullet("Step 2 (Context Extraction):", "Normalized parcel parameters (setbacks, frontage road traffic, catchment area) are extracted via the Forma Adapter.")
    add_bullet("Step 3 (ResiliForma Screening):", "Planners launch the ResiliForma extension panel to screen road noise, solar façade exposure, and runoff.")
    add_bullet("Step 4 (Parameter Exploration):", "Sliders allow rapid real-time testing of earth berm heights, vegetation depths, louvers, and bioswales.")
    add_bullet("Step 5 (Proposal Comparison):", "Baseline and resilient design variants are compared side-by-side with delta metrics.")
    add_bullet("Step 6 (Design Decision):", "The planner selects the preferred climate-resilient configuration.")
    add_bullet("Step 7 (Detailed BIM Handshake):", "The finalized concept proceeds to Autodesk Forma Board, Revit BIM detailing, and statutory verification.")

    # 8. RISK ANALYSIS & MITIGATION
    add_h1("8. Risk Analysis & Engineered Mitigations")
    
    # Table 4: Risk Matrix
    p_t4 = doc.add_paragraph()
    p_t4.paragraph_format.space_before = Pt(4)
    p_t4.paragraph_format.space_after = Pt(2)
    r = p_t4.add_run("Table 4: Technical & Operational Risk Mitigation Matrix")
    r.font.bold = True
    r.font.size = Pt(9)
    r.font.color.rgb = TEAL

    t4 = doc.add_table(rows=5, cols=4)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t4)
    t4_headers = ["Risk Category", "Identified Risk Description", "Severity / Likelihood", "Engineered Mitigation Strategy"]
    t4_rows = [
        ("Screening Approximation Limit", "Deterministic formulas may deviate from wave physics in highly complex geometry.", "Medium / Low", "Strictly position as an early-stage screening co-pilot; require native Forma/Revit verification."),
        ("Forma SDK / API Evolution", "Future Autodesk Forma SDK updates could alter geometric data schemas.", "High / Low", "Decoupled adapter interface (IFormaAdapter) with Pydantic validation isolating calculations."),
        ("Zero-Credential Environments", "Hackathon judges or offline users may lack Autodesk developer API keys.", "High / Medium", "Built-in zero-dependency Demo Mode with preloaded Karunya Nagar dataset and local engine fallback."),
        ("Site Spatial Constraints", "3.5m earth berms may exceed narrow urban right-of-way setbacks.", "Medium / Medium", "System supports modular combination of vertical acoustic walls with dense native vegetation buffers.")
    ]
    for c_i, h_text in enumerate(t4_headers):
        cell = t4.rows[0].cells[c_i]
        set_cell_margins(cell, top=50, bottom=50, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = NAVY
        set_cell_background(cell, "E2E8F0")

    for r_i, (col0, col1, col2, col3) in enumerate(t4_rows):
        row = t4.rows[r_i + 1]
        for c_i, val in enumerate([col0, col1, col2, col3]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=45, bottom=45, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            run.font.color.rgb = DARK_TEXT
            set_cell_background(cell, "FFFFFF" if r_i % 2 == 0 else "F8FAFC")

    # 9. TEAM CONTRIBUTIONS & RESPONSIBILITIES
    add_h1("9. Team Contributions & Division of Work")
    
    # Table 5: Team Matrix
    p_t5 = doc.add_paragraph()
    p_t5.paragraph_format.space_before = Pt(4)
    p_t5.paragraph_format.space_after = Pt(2)
    r = p_t5.add_run("Table 5: Team Members & Core Technical Responsibilities")
    r.font.bold = True
    r.font.size = Pt(9)
    r.font.color.rgb = TEAL

    t5 = doc.add_table(rows=7, cols=3)
    t5.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t5)
    t5_headers = ["Team Member", "Discipline & Project Role", "Key Technical Deliverables"]
    t5_rows = [
        ("Chris David Raj A", "Computer Science & Engg / Team Lead & Architect", "FastAPI backend architecture, Autodesk Forma adapter integration, React state pipeline, and system integration."),
        ("Jenisia Mary", "Computer Science & Engg / Physics Screening Lead", "Acoustic berm diffraction modeling, vegetation buffer formula calibration, and solar azimuth deflection."),
        ("Harry Joseph", "Computer Science & Engg / Hydrology & UI Engineer", "Rational Method stormwater calculations, SuDS bioswale sizing, and interactive slider design controls."),
        ("Chandy N Jomon", "Computer Science & Engg / Spatial Visualization Dev", "2.5D SVG spatial canvas layout, dynamic parcel rotation, and visual hazard heatmap overlays."),
        ("Jeffrey", "Computer Science & Engg / Scoring & API Engineer", "Multi-objective composite resilience score algorithm, REST API endpoints, and Pydantic validation."),
        ("Kenrich Gladson", "Computer Science & Engg / QA & Documentation Lead", "Automated Pytest test suite (15 test cases), benchmark documentation, and SIH proposal compilation.")
    ]
    for c_i, h_text in enumerate(t5_headers):
        cell = t5.rows[0].cells[c_i]
        set_cell_margins(cell, top=50, bottom=50, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = NAVY
        set_cell_background(cell, "E2E8F0")

    for r_i, (col0, col1, col2) in enumerate(t5_rows):
        row = t5.rows[r_i + 1]
        for c_i, val in enumerate([col0, col1, col2]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=45, bottom=45, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            run.font.color.rgb = DARK_TEXT
            set_cell_background(cell, "FFFFFF" if r_i % 2 == 0 else "F8FAFC")

    # 10. CONCLUSION & REFERENCES
    add_h1("10. Conclusion & References")
    doc.add_paragraph(
        "ResiliForma demonstrates how supplementary deterministic screening extensions can empower urban planners to design for resilience before "
        "detailed engineering design. By bridging early-stage massing in Autodesk Forma with instant multi-hazard analytics (road noise, solar irradiance, "
        "and stormwater retention), planners can eliminate costly redesign cycles and achieve high-performance sustainable smart city master plans. "
        "The application is fully implemented, rigorously tested with 15 passing automated test cases, and positioned to support Autodesk Forma workflows for SIH26114."
    )

    add_h2("10.1. Key References")
    add_bullet("[1]", "Autodesk Inc., 'Autodesk Forma Developer Documentation & Extension Web SDK,' Autodesk Developer Network, 2025.")
    add_bullet("[2]", "ISO 9613-2:1996, 'Acoustics — Attenuation of sound during propagation outdoors — Part 2: General method of calculation,' International Organization for Standardization.")
    add_bullet("[3]", "Chow, V. T., Maidment, D. R., and Mays, L. W., 'Applied Hydrology (Rational Method for Urban Drainage),' McGraw-Hill, New York, 1988.")
    add_bullet("[4]", "Bureau of Indian Standards, 'National Building Code of India 2016 (NBC 2016) — Part 8: Building Services, Section 4: Acoustics, Sound Insulation and Noise Control,' New Delhi.")
    add_bullet("[5]", "Central Pollution Control Board (CPCB), 'Ambient Air Quality Standards in Respect of Noise,' Ministry of Environment, Forest and Climate Change, Government of India, 2000.")
    add_bullet("[6]", "GRIHA Council, 'GRIHA Version 2019: Green Rating for Integrated Habitat Assessment,' The Energy and Resources Institute (TERI), New Delhi.")

    # Save in place
    doc.save(target_path)
    print(f"Successfully updated proposal in place at: {target_path}")

if __name__ == '__main__':
    build_sih_proposal()
