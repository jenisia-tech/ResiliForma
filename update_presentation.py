import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def update_presentation_file(pptx_path="/Users/Chris David/Documents/SIH/ResiliForma-SIH2026-Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)  # 16:9 widescreen
    prs.slide_height = Inches(7.5)

    # Executive Color Palette (High Contrast, Technical Architecture Theme)
    DARK_BG = RGBColor(11, 15, 25)        # #0B0F19 (Deep Slate)
    CARD_BG = RGBColor(17, 24, 39)        # #111827 (Surface Dark)
    CARD_BORDER = RGBColor(30, 41, 59)    # #1E293B (Subtle Slate Border)
    CYAN_ACCENT = RGBColor(6, 182, 212)   # #06B6D4 (Technical Cyan)
    CYAN_LIGHT = RGBColor(103, 232, 249)  # #67E8F9
    EMERALD = RGBColor(16, 185, 129)      # #10B981 (Success Green)
    AMBER = RGBColor(245, 158, 11)        # #F59E0B (Solar Amber)
    PURPLE = RGBColor(139, 92, 246)       # #8B5CF6 (Screening Violet)
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_SUBTLE = RGBColor(100, 116, 139) # #64748B

    def add_base_slide(title_text, category_badge="SMART INDIA HACKATHON 2026"):
        slide = prs.slides.add_slide(prs.slide_layouts[6])
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = DARK_BG
        bg.line.fill.background()
        
        # Header Box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.73), Inches(0.95))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p0 = tf.paragraphs[0]
        p0.text = category_badge.upper()
        p0.font.size = Pt(9.5)
        p0.font.bold = True
        p0.font.color.rgb = CYAN_ACCENT
        
        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(18)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(3)
        
        # Footer
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.73), Inches(0.35))
        ftf = footer.text_frame
        ftf.margin_left = ftf.margin_top = ftf.margin_right = ftf.margin_bottom = 0
        fp = ftf.paragraphs[0]
        fp.text = "ResiliForma • Deterministic Multi-Hazard Screening Extension • Problem Statement ID: SIH26114 (Autodesk Forma)"
        fp.font.size = Pt(8.5)
        fp.font.color.rgb = TEXT_SUBTLE
        
        return slide

    # =========================================================================
    # SLIDE 1: TITLE & EXECUTIVE OVERVIEW
    # =========================================================================
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = DARK_BG
    bg1.line.fill.background()

    card1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.7), Inches(11.73), Inches(6.1))
    card1.fill.solid()
    card1.fill.fore_color.rgb = CARD_BG
    card1.line.color.rgb = CARD_BORDER
    card1.line.width = Pt(1.5)

    tf1 = card1.text_frame
    tf1.word_wrap = True
    tf1.margin_left = Inches(0.6)
    tf1.margin_top = Inches(0.45)
    tf1.margin_right = Inches(0.6)

    p = tf1.paragraphs[0]
    p.text = "SMART INDIA HACKATHON 2026 | TECHNICAL IDEA PROPOSAL"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    p = tf1.add_paragraph()
    p.text = "ResiliForma"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(4)

    p = tf1.add_paragraph()
    p.text = "A Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = CYAN_LIGHT
    p.space_before = Pt(2)

    p = tf1.add_paragraph()
    p.text = "ResiliForma provides fast, transparent acoustic, solar and stormwater screening during early-stage site planning using deterministic engineering models and multi-objective heuristic ranking. Autodesk Forma Site Design remains the PRIMARY 3D design platform; ResiliForma operates as a supplementary decision-support extension."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_before = Pt(12)

    p = tf1.add_paragraph()
    p.text = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    p.font.size = Pt(9)
    p.font.color.rgb = CARD_BORDER
    p.space_before = Pt(12)

    p = tf1.add_paragraph()
    p.text = "Problem Statement ID: SIH26114  |  Title: Smart City Site Planning using Autodesk Forma Site Design  |  Target: Autodesk"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(6)

    p = tf1.add_paragraph()
    p.text = "Demonstration Benchmark: Karunya Nagar Smart City Sector (1.2 km² / 120 ha), Coimbatore South, Tamil Nadu"
    p.font.size = Pt(9.5)
    p.font.color.rgb = EMERALD
    p.space_before = Pt(3)

    p = tf1.add_paragraph()
    p.text = "Team Lead: Chris David Raj A  |  Members: Jenisia Mary, Harry Joseph, Chandy N Jomon, Jeffrey, Kenrich Gladson"
    p.font.size = Pt(9.5)
    p.font.color.rgb = TEXT_MUTED
    p.space_before = Pt(3)

    p = tf1.add_paragraph()
    p.text = "Institution: Karunya Institute of Technology and Sciences, Coimbatore, Tamil Nadu"
    p.font.size = Pt(9)
    p.font.color.rgb = TEXT_SUBTLE
    p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 2: THE 3 EMPIRICAL PLANNING HAZARDS
    # =========================================================================
    slide2 = add_base_slide("Early-Stage Site Hazards: Road Noise, Solar Exposure & Stormwater Runoff", "EMPIRICAL PLANNING HAZARDS")
    
    col_w = Inches(3.75)
    col_gap = Inches(0.24)
    top_y = Inches(1.5)
    card_h = Inches(5.3)

    hazards = [
        ("1. Road Traffic Noise", "Arterial Transit Corridors", 
         "Heavy highway traffic (e.g. NH-544 / Siruvani Road) produces 78–82 dBA at parcel frontages.",
         "Substantially exceeds CPCB residential daytime limit of 55 dBA, causing health and acoustic stress.",
         "Standard conceptual CAD tools lack fast barrier diffraction & tree buffer screening to guide frontage setbacks.",
         CYAN_ACCENT),
        ("2. Façade Solar Exposure", "Tropical Afternoon Thermal Glare",
         "Unoptimized building orientations expose western glazing to direct solar radiation (>700 W/m²).",
         "Drives peak cooling HVAC energy demands up by 30%+ and amplifies urban microclimate heat islands.",
         "Detailed Radiance/CFD simulations take hours, meaning massing azimuths are locked in unshaded.",
         AMBER),
        ("3. Stormwater Runoff", "Monsoon Impervious Disruption",
         "Post-development site imperviousness increases runoff coefficient from baseline C=0.30 to C=0.85.",
         "Produces 3.23 m³/s peak runoff during 65 mm/hr monsoon storms over 21.04 ha catchments.",
         "Drainage swales and retention basins are typically designed post-facto rather than integrated upfront.",
         EMERALD)
    ]

    for i, (h_title, h_sub, h_cond, h_pen, h_chal, h_color) in enumerate(hazards):
        cx = Inches(0.8) + i * (col_w + col_gap)
        cbox = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, col_w, card_h)
        cbox.fill.solid()
        cbox.fill.fore_color.rgb = CARD_BG
        cbox.line.color.rgb = CARD_BORDER
        cbox.line.width = Pt(1.5)
        
        ctf = cbox.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = Inches(0.28)
        ctf.margin_top = Inches(0.3)
        
        p = ctf.paragraphs[0]
        p.text = h_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = h_color
        
        p = ctf.add_paragraph()
        p.text = h_sub
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(2)
        
        p = ctf.add_paragraph()
        p.text = "━━━━━━━━━━━━━━━━━━━━━━"
        p.font.size = Pt(7)
        p.font.color.rgb = CARD_BORDER
        p.space_before = Pt(4)
        
        p = ctf.add_paragraph()
        p.text = "Empirical Condition:"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(6)
        
        p = ctf.add_paragraph()
        p.text = h_cond
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(2)
        
        p = ctf.add_paragraph()
        p.text = "Environmental Penalty:"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(8)
        
        p = ctf.add_paragraph()
        p.text = h_pen
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(2)
        
        p = ctf.add_paragraph()
        p.text = "Early-Stage Challenge:"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(8)
        
        p = ctf.add_paragraph()
        p.text = h_chal
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(2)

    # =========================================================================
    # SLIDE 3: SYSTEM ARCHITECTURE & 7-STEP PIPELINE
    # =========================================================================
    slide3 = add_base_slide("How ResiliForma Works: Architecture & 7-Step Workflow Pipeline", "TECHNICAL DATA FLOW")

    step_w = Inches(2.76)
    step_gap = Inches(0.23)
    step_y = Inches(1.5)
    step_h = Inches(3.6)

    flow_steps = [
        ("Layer 1: Autodesk Forma", "Primary Site Design",
         "• Authors 3D building masses\n• Terrain & road boundaries\n• Native daylight & carbon analytics\n• Primary smart city CAD host",
         CYAN_ACCENT),
        ("Layer 2: Forma Adapter", "TypeScript IFormaAdapter",
         "• Extracts normalized site JSON\n• Reads frontage noise traffic\n• Handshakes via Web SDK iframe\n• Zero-dependency demo fallback",
         PURPLE),
        ("Layer 3: FastAPI Backend", "Python 3.11 Solver Engine",
         "• Fast asynchronous REST API\n• Pydantic v2 schema validation\n• ISO 9613-2 acoustic diffraction\n• Rational Method stormwater SuDS",
         AMBER),
        ("Layer 4: Dashboard & Revit", "Decision Support Handshake",
         "• 2.5D SVG interactive canvas\n• Real-time parameter exploration\n• Forma Board proposal comparison\n• Exports to detailed Revit BIM",
         EMERALD)
    ]

    for i, (s_title, s_sub, s_desc, s_color) in enumerate(flow_steps):
        sx = Inches(0.8) + i * (step_w + step_gap)
        sbox = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, sx, step_y, step_w, step_h)
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = CARD_BG
        sbox.line.color.rgb = CARD_BORDER
        sbox.line.width = Pt(1.5)
        
        stf = sbox.text_frame
        stf.word_wrap = True
        stf.margin_left = stf.margin_right = Inches(0.22)
        stf.margin_top = Inches(0.25)
        
        p = stf.paragraphs[0]
        p.text = s_title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = s_color
        
        p = stf.add_paragraph()
        p.text = s_sub
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(2)
        
        p = stf.add_paragraph()
        p.text = "━━━━━━━━━━━━━━━━━"
        p.font.size = Pt(6)
        p.font.color.rgb = CARD_BORDER
        p.space_before = Pt(3)
        
        p = stf.add_paragraph()
        p.text = s_desc
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(6)

    # Bottom Pipeline Box
    bottom_box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.3), Inches(11.73), Inches(1.55))
    bottom_box.fill.solid()
    bottom_box.fill.fore_color.rgb = CARD_BG
    bottom_box.line.color.rgb = CARD_BORDER
    bottom_box.line.width = Pt(1.5)

    btf = bottom_box.text_frame
    btf.word_wrap = True
    btf.margin_left = btf.margin_right = Inches(0.3)
    btf.margin_top = Inches(0.2)

    p = btf.paragraphs[0]
    p.text = "7-Step End-to-End Decision Pipeline: From Conceptual Sketching to Detailed BIM"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = CYAN_LIGHT

    p = btf.add_paragraph()
    p.text = "1. Author in Forma (3D Massing) ➔ 2. Extract Context (IFormaAdapter) ➔ 3. Screen Multi-Hazards (FastAPI) ➔ 4. Explore Sliders (Interactive Canvas) ➔ 5. Compare Baseline vs Resilient ➔ 6. Select Climate-Resilient Strategy ➔ 7. Handshake to Forma Board & Revit BIM."
    p.font.size = Pt(9.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(4)

    p = btf.add_paragraph()
    p.text = "• Forma Native Verification: 8/8 Forma native analyses (Area Metrics, Embodied Carbon, Sun Hours, Daylight, Wind, Microclimate, Noise, Solar Energy) remain authoritative."
    p.font.size = Pt(8.5)
    p.font.color.rgb = EMERALD
    p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 4: PROTOTYPE IMPLEMENTATION & INTERACTIVE CANVAS
    # =========================================================================
    slide4 = add_base_slide("Working Prototype: Interactive Spatial Canvas & Design Controls", "PROTOTYPE IMPLEMENTATION")

    left_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.75), Inches(5.3))
    left_box.fill.solid()
    left_box.fill.fore_color.rgb = CARD_BG
    left_box.line.color.rgb = CARD_BORDER
    left_box.line.width = Pt(1.5)

    ltf = left_box.text_frame
    ltf.word_wrap = True
    ltf.margin_left = ltf.margin_right = Inches(0.3)
    ltf.margin_top = Inches(0.28)

    p = ltf.paragraphs[0]
    p.text = "Interactive Spatial Canvas & UI Features"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    items_left = [
        ("Interactive 2.5D SVG Spatial Canvas:", "Visualizes 26 building parcels, NH-544 arterial road noise emitter, acoustic berm thickness, native tree buffer, bioswales, and retention basin with parcel tooltips."),
        ("Dynamic Parameter Sliders:", "Allows planners to adjust acoustic barrier height (0–5m), vegetation depth (0–16m), louver depth (0–2m), orientation azimuth (-30° to +30°), and rainfall intensity (40–100 mm/hr)."),
        ("Live Multi-Hazard Screening Panels:", "Displays real-time before/after noise dBA, solar façade irradiance (W/m²), Rational peak runoff (Q_peak), and water-routing process diagram."),
        ("One-Click Proposal Switching:", "Instant toggling between Baseline Proposal (Grade D: 48) and Resilient Proposal (Grade A: 87) with immediate visual and analytical updates.")
    ]
    for b_title, b_desc in items_left:
        p = ltf.add_paragraph()
        p.text = b_title
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(7)
        
        p = ltf.add_paragraph()
        p.text = b_desc
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(1)

    right_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.78), Inches(1.5), Inches(5.75), Inches(5.3))
    right_box.fill.solid()
    right_box.fill.fore_color.rgb = CARD_BG
    right_box.line.color.rgb = CARD_BORDER
    right_box.line.width = Pt(1.5)

    rtf = right_box.text_frame
    rtf.word_wrap = True
    rtf.margin_left = rtf.margin_right = Inches(0.3)
    rtf.margin_top = Inches(0.28)

    p = rtf.paragraphs[0]
    p.text = "Deterministic Formulations & Integration Rigor"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    items_right = [
        ("Acoustic Screening Formula:", "Optimized Noise = Baseline (78 dBA) - min(18, h_barrier × 3.1) - min(8, (d_veg / 8) × 4.2). Yields 62.94 dBA (~15 dB reduction)."),
        ("Solar Irradiance Screening Formula:", "Total Relief % = min(45, |θ| × 0.45 + 12 + (d_louver / 1.2) × 11.9). Yields 32% reduction (482.8 W/m² vs 710 W/m²)."),
        ("Stormwater Rational Method:", "Q_peak = 0.278 × C × I × A = 3.23 m³/s (C=0.85, I=65 mm/hr, A=21.04 ha). SuDS sizing (644m swales + 7,800 m³ basin) achieves 82% retention."),
        ("Automated Quality Assurance:", "15 Pytest unit and integration tests validate all mathematical caps, physical bounds, and API endpoints with 100% pass rate.")
    ]
    for b_title, b_desc in items_right:
        p = rtf.add_paragraph()
        p.text = b_title
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(7)
        
        p = rtf.add_paragraph()
        p.text = b_desc
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(1)

    # =========================================================================
    # SLIDE 5: EMPIRICAL RESULTS & PROPOSAL COMPARISON
    # =========================================================================
    slide5 = add_base_slide("Prototype Benchmark: Modeled Performance on Karunya Nagar Site", "EMPIRICAL MODELING RESULTS")

    kpi_w = Inches(2.76)
    kpi_gap = Inches(0.23)
    kpi_y = Inches(1.5)
    kpi_h = Inches(2.1)

    kpis = [
        ("RESILIENCE SCORE", "87 / 100", "GRADE A (+39 pts)", "Baseline: 48 / 100 (Grade D)", EMERALD),
        ("ROAD TRAFFIC NOISE", "-15.05 dB", "62.94 dBA", "Improved Exposure (< 65 dBA)", CYAN_ACCENT),
        ("FAÇADE SOLAR RELIEF", "-32.0%", "482.8 W/m²", "Baseline: 710 W/m² (-18° & 1.2m)", AMBER),
        ("STORMWATER SUDS", "82.0%", "Retained", "644m swales & 7,800 m³ basin", PURPLE)
    ]

    for i, (k_title, k_val, k_sub, k_desc, k_color) in enumerate(kpis):
        kx = Inches(0.8) + i * (kpi_w + kpi_gap)
        kbox = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, kx, kpi_y, kpi_w, kpi_h)
        kbox.fill.solid()
        kbox.fill.fore_color.rgb = CARD_BG
        kbox.line.color.rgb = CARD_BORDER
        kbox.line.width = Pt(1.5)
        
        ktf = kbox.text_frame
        ktf.word_wrap = True
        ktf.margin_left = ktf.margin_right = Inches(0.2)
        ktf.margin_top = Inches(0.18)
        
        p = ktf.paragraphs[0]
        p.text = k_title
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_MUTED
        
        p = ktf.add_paragraph()
        p.text = k_val
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = k_color
        p.space_before = Pt(2)
        
        p = ktf.add_paragraph()
        p.text = k_sub
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(1)
        
        p = ktf.add_paragraph()
        p.text = k_desc
        p.font.size = Pt(7.5)
        p.font.color.rgb = TEXT_SUBTLE
        p.space_before = Pt(2)

    # Bottom Table Box
    bot_table_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.8), Inches(11.73), Inches(3.0))
    bot_table_box.fill.solid()
    bot_table_box.fill.fore_color.rgb = CARD_BG
    bot_table_box.line.color.rgb = CARD_BORDER
    bot_table_box.line.width = Pt(1.5)

    bttf = bot_table_box.text_frame
    bttf.word_wrap = True
    bttf.margin_left = bttf.margin_right = Inches(0.3)
    bttf.margin_top = Inches(0.2)

    p = bttf.paragraphs[0]
    p.text = "Baseline vs. Resilient Proposal Comparison Summary (Karunya Nagar 1.2 km² Demonstration Site)"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = CYAN_LIGHT

    comp_items = [
        ("• Façade Orientation:", "Baseline 0° (Direct West) ➔ Resilient -18° Azimuth Deflection (-20.1% solar relief)"),
        ("• Acoustic Mitigation:", "Baseline None (78 dBA) ➔ Resilient 3.5m Earth Berm + 8m Tree Buffer (62.94 dBA, Improved Exposure, -15.05 dB)"),
        ("• Façade Shading:", "Baseline Unshaded (710 W/m²) ➔ Resilient 1.2m Horizontal Louvers (482.8 W/m², 32% total drop)"),
        ("• SuDS Drainage:", "Baseline None (10% retention) ➔ Resilient 644m Bioswales + 7,800 m³ Pond (82.0% runoff management)"),
        ("• Composite Resilience:", "Baseline 48 / 100 (Grade D — Vulnerable) ➔ Resilient 87 / 100 (Grade A — Resilient, +39 Point Gain)")
    ]
    for c_prefix, c_val in comp_items:
        p = bttf.add_paragraph()
        p.text = f"{c_prefix} {c_val}"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 6: SCOPE, LIMITATIONS & ROADMAP
    # =========================================================================
    slide6 = add_base_slide("Scope, Model Boundaries & Phased Engineering Roadmap", "SCOPE & ROADMAP")

    s6_left = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.75), Inches(5.3))
    s6_left.fill.solid()
    s6_left.fill.fore_color.rgb = CARD_BG
    s6_left.line.color.rgb = CARD_BORDER
    s6_left.line.width = Pt(1.5)

    s6_ltf = s6_left.text_frame
    s6_ltf.word_wrap = True
    s6_ltf.margin_left = s6_ltf.margin_right = Inches(0.3)
    s6_ltf.margin_top = Inches(0.28)

    p = s6_ltf.paragraphs[0]
    p.text = "Scope, Boundaries & Disclaimers"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    p = s6_ltf.add_paragraph()
    p.text = "ResiliForma is an early-stage screening co-pilot for Autodesk Forma. Its deterministic models provide rapid comparative estimates and do not replace certified engineering simulations."
    p.font.size = Pt(9)
    p.font.color.rgb = TEXT_MUTED
    p.space_before = Pt(4)

    boundaries = [
        ("Acoustic Boundary:", "Provides geometric diffraction & vegetation absorption screening. Full 3D wave ray-tracing remains in Autodesk Forma / specialized acoustic software."),
        ("Solar Boundary:", "Calculates peak direct envelope irradiance relief from orientation and louvers. Annual dynamic HVAC/energy modeling remains verified in Revit / EnergyPlus."),
        ("Stormwater Boundary:", "Applies the lumped Rational Method and SuDS retention volume sizing. 2D hydrodynamic flood simulations remain verified in EPA SWMM / HEC-RAS."),
        ("Forma Board Workflow:", "Final multi-proposal spatial decision presentation is aligned with Autodesk Forma Board.")
    ]
    for b_title, b_desc in boundaries:
        p = s6_ltf.add_paragraph()
        p.text = b_title
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(5)
        
        p = s6_ltf.add_paragraph()
        p.text = b_desc
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(1)

    s6_right = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.78), Inches(1.5), Inches(5.75), Inches(5.3))
    s6_right.fill.solid()
    s6_right.fill.fore_color.rgb = CARD_BG
    s6_right.line.color.rgb = CARD_BORDER
    s6_right.line.width = Pt(1.5)

    s6_rtf = s6_right.text_frame
    s6_rtf.word_wrap = True
    s6_rtf.margin_left = s6_rtf.margin_right = Inches(0.3)
    s6_rtf.margin_top = Inches(0.28)

    p = s6_rtf.paragraphs[0]
    p.text = "Development Status & Phased Roadmap"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    phases = [
        ("Current Hackathon Prototype (Implemented & Tested):",
         "• FastAPI deterministic screening engine with 15 passing Pytest cases\n• React 18 / TypeScript interactive 2.5D SVG spatial dashboard\n• Zero-credential Demo Mode with Karunya Nagar 1.2 km² dataset\n• Forma Adapter architecture ready for iframe extension deployment"),
        ("Phase 2: Live SDK Bridges (Months 1–3 Future):",
         "• Live two-way geometry handshake via Autodesk Forma Web SDK\n• Microclimate wind comfort & EnergyPlus solar validation bridges\n• Custom site polygon GeoJSON import & automated parcel subdivision"),
        ("Phase 3: Production & App Store Submission (Months 4–6 Future):",
         "• Autodesk Platform Services (APS) security & compliance review\n• Official Autodesk Forma App Store extension submission\n• Smart City municipal pilot deployments across Tamil Nadu & India")
    ]
    for ph_title, ph_desc in phases:
        p = s6_rtf.add_paragraph()
        p.text = ph_title
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(6)
        
        p = s6_rtf.add_paragraph()
        p.text = ph_desc
        p.font.size = Pt(8)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(1)

    prs.save(pptx_path)
    print(f"Successfully updated presentation file in place at: {pptx_path}")

if __name__ == '__main__':
    update_presentation_file()
