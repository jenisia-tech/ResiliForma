import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    template_path = "/Users/Chris David/Downloads/SIH2026-IDEA-Presentation-Format.pptx"
    if not os.path.exists(template_path):
        template_path = "/Users/Chris David/Documents/SIH/SIH_OLD/SIH2026-IDEA-Presentation-Format.pptx"
    
    prs = Presentation(template_path)
    
    # Palette tailored to match official template styling
    COLOR_PRIMARY = RGBColor(26, 54, 93)      # #1A365D Deep Navy
    COLOR_ACCENT = RGBColor(14, 116, 144)    # #0E7490 Deep Cyan/Teal
    COLOR_DARK = RGBColor(30, 41, 59)        # #1E293B Slate Dark
    COLOR_BODY = RGBColor(51, 65, 85)        # #334155 Slate
    COLOR_MUTED = RGBColor(100, 116, 139)    # #64748B Slate Muted
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_HIGHLIGHT = RGBColor(3, 105, 161)  # #0369A1 Sky/Blue Highlight

    def style_paragraph(p, text="", font_size=Pt(12), bold=False, color=COLOR_BODY, space_after=Pt(4), space_before=Pt(0)):
        p.text = text
        p.font.size = font_size
        p.font.bold = bold
        p.font.color.rgb = color
        p.font.name = "Calibri"
        p.space_after = space_after
        p.space_before = space_before

    def add_bullet_item(tf, heading, body, font_size=Pt(11.5), heading_color=COLOR_PRIMARY, body_color=COLOR_BODY, space_after=Pt(4), space_before=Pt(2), indent=0):
        p = tf.add_paragraph()
        p.space_before = space_before
        p.space_after = space_after
        p.font.name = "Calibri"
        
        prefix = "  " * indent + "• " if indent > 0 else "• "
        r1 = p.add_run()
        r1.text = prefix + heading + (" " if body else "")
        r1.font.bold = True
        r1.font.size = font_size
        r1.font.color.rgb = heading_color
        r1.font.name = "Calibri"
        
        if body:
            r2 = p.add_run()
            r2.text = body
            r2.font.bold = False
            r2.font.size = font_size
            r2.font.color.rgb = body_color
            r2.font.name = "Calibri"
        return p

    def add_section_header(tf, title, font_size=Pt(13), color=COLOR_ACCENT, space_before=Pt(8), space_after=Pt(3)):
        p = tf.add_paragraph()
        p.space_before = space_before
        p.space_after = space_after
        p.font.name = "Calibri"
        r = p.add_run()
        r.text = title
        r.font.bold = True
        r.font.size = font_size
        r.font.color.rgb = color
        r.font.name = "Calibri"
        return p

    # ----------------------------------------------------
    # Update "Your Team Name" Oval Badge on all slides
    # ----------------------------------------------------
    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_text_frame and "Your Team Name" in shape.text_frame.text:
                tf = shape.text_frame
                tf.text = "Jenisia-Tech"
                p = tf.paragraphs[0]
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                p.font.size = Pt(11)
                p.font.color.rgb = COLOR_WHITE
                p.font.name = "Calibri"

    # ====================================================
    # SLIDE 1: TITLE PAGE
    # ====================================================
    s1 = prs.slides[0]
    for shape in s1.shapes:
        if shape.name == "Subtitle 3" or shape.shape_id == 4:
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            style_paragraph(p, "ResiliForma: Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma", Pt(16), True, COLOR_PRIMARY, Pt(2), Pt(0))
            p2 = tf.add_paragraph()
            style_paragraph(p2, "Early-Stage Multi-Hazard Decision Support Co-Pilot for Sustainable Smart City Site Planning", Pt(12), False, COLOR_ACCENT, Pt(0), Pt(2))
        
        elif shape.name == "TextBox 9" or shape.shape_id == 10:
            shape.left = Inches(0.6)
            shape.top = Inches(2.2)
            shape.width = Inches(7.0)
            shape.height = Inches(4.8)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()
            
            items = [
                ("Problem Statement ID –", "SIH26114"),
                ("Problem Statement Title –", "Smart City Site Planning using Autodesk Forma Site Design"),
                ("Theme –", "Smart Cities / Sustainable Infrastructure & Urban Planning"),
                ("PS Category –", "Software"),
                ("Team Name –", "Jenisia-Tech"),
                ("Target Organization –", "Autodesk"),
                ("Institution –", "Karunya Institute of Technology and Sciences, Coimbatore, Tamil Nadu"),
                ("Team Leader –", "Chris David Raj A (Computer Science & Engineering)"),
                ("Team Members –", "Jenisia Mary, Harry Joseph, Chandy N Jomon, Jeffrey, Kenrich Gladson")
            ]
            
            for i, (label, val) in enumerate(items):
                p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
                p.space_before = Pt(2)
                p.space_after = Pt(4)
                p.font.name = "Calibri"
                
                r1 = p.add_run()
                r1.text = label + " "
                r1.font.bold = True
                r1.font.size = Pt(11.5)
                r1.font.color.rgb = COLOR_PRIMARY
                r1.font.name = "Calibri"
                
                r2 = p.add_run()
                r2.text = val
                r2.font.bold = (label in ["Team Name –", "Problem Statement ID –"])
                r2.font.size = Pt(11.5)
                r2.font.color.rgb = COLOR_HIGHLIGHT if label in ["Team Name –", "Problem Statement ID –"] else COLOR_DARK
                r2.font.name = "Calibri"

    # ====================================================
    # SLIDE 2: IDEA TITLE & PROPOSED SOLUTION
    # ====================================================
    s2 = prs.slides[1]
    for shape in s2.shapes:
        if shape.name == "Title 1" or shape.shape_id == 15361:
            shape.text_frame.text = "IDEA TITLE: ResiliForma (Multi-Hazard Screening Extension)"
            p = shape.text_frame.paragraphs[0]
            p.font.size = Pt(26)
            p.font.bold = True
            p.font.color.rgb = COLOR_PRIMARY
            p.font.name = "Calibri"
            
        elif shape.name == "TextBox 8" or shape.shape_id == 15362:
            shape.left = Inches(0.6)
            shape.top = Inches(1.3)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()
            
            add_section_header(tf, "1. Proposed Solution (Idea / Solution / Prototype)", Pt(12.5), COLOR_ACCENT, Pt(0), Pt(2))
            add_bullet_item(tf, "ResiliForma Core Concept:", "An early-stage deterministic screening extension designed to operate natively alongside Autodesk Forma Site Design (SIH26114). It evaluates 3 critical environmental hazards in real time: Road Traffic Noise, Façade Solar Irradiance, and Stormwater Runoff.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Demonstration Site:", "Evaluated on a 1.2 km² (120 ha) smart city benchmark in Karunya Nagar, Coimbatore South (10.9366° N, 76.7441° E, 26 building blocks along NH-544 / Siruvani Road arterial corridor).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))
            
            add_section_header(tf, "2. Detailed Explanation of the Proposed Solution", Pt(12.5), COLOR_ACCENT, Pt(6), Pt(2))
            add_bullet_item(tf, "Direct Forma Ingestion:", "Reads site boundaries, building massing polygons, setbacks, and road network coordinates directly from Autodesk Forma via REST / Web SDK serialization.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Sub-50ms Deterministic Engine:", "Executes physics-informed equations (FastAPI + NumPy) in milliseconds, eliminating slow cloud CFD/Radiance queue delays during conceptual sketching.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Composite Scoring (0–100):", "Generates an objective resilience score comparing Baseline vs. Resilient proposals side-by-side with full sub-metric parameter transparency.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

            add_section_header(tf, "3. How It Addresses the Problem & Innovation / Uniqueness", Pt(12.5), COLOR_ACCENT, Pt(6), Pt(2))
            add_bullet_item(tf, "Solves Simulation Latency Gap:", "Enables architects to explore trade-offs before building orientations and civil infrastructure layouts are locked in.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Interactive Mitigation Levers:", "Provides real-time sliders for acoustic berms (1–5m), vegetative buffers (2–15m), louvers (0.5–2m), orientation tuning (±30°), bioswales (100–1000m), and retention ponds (1,000–12,000 m³).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Dual Domain Modes & Forma Verification:", "Includes 'Transit-Sanctum' (acoustic priority) and 'Eco-Retention' (stormwater priority) modes, plus an integrated Forma Native Analysis Verification Checklist (Wind, Daylight, Embodied Carbon).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

    # ====================================================
    # SLIDE 3: TECHNICAL APPROACH
    # ====================================================
    s3 = prs.slides[2]
    for shape in s3.shapes:
        if shape.name == "Title 1" or shape.shape_id == 17409:
            shape.text_frame.text = "TECHNICAL APPROACH & ARCHITECTURE"
            p = shape.text_frame.paragraphs[0]
            p.font.size = Pt(26)
            p.font.bold = True
            p.font.color.rgb = COLOR_PRIMARY
            p.font.name = "Calibri"
            
        elif shape.name == "TextBox 8" or shape.shape_id == 17410:
            shape.left = Inches(0.6)
            shape.top = Inches(1.3)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()
            
            add_section_header(tf, "1. Technologies Used (Full-Stack Architecture)", Pt(12.5), COLOR_ACCENT, Pt(0), Pt(2))
            add_bullet_item(tf, "Frontend Client Layer:", "React 18, TypeScript, Vite, SVG 2.5D Spatial Canvas, TailwindCSS & modern glassmorphic UI; responsive iframe extension embedded within Autodesk Forma.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Deterministic Backend Engine:", "Python 3.11, FastAPI, Pydantic v2 schemas, NumPy matrix math, Uvicorn ASGI server; delivers sub-50ms execution and 100% test coverage (pytest).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Integration & APIs:", "Autodesk Forma Web SDK, REST JSON payload serialization, and structured Forma verification pipelines.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

            add_section_header(tf, "2. Methodology and Process for Implementation", Pt(12.5), COLOR_ACCENT, Pt(6), Pt(2))
            add_bullet_item(tf, "Stage 1 — Geometry Ingestion:", "Ingests 3D massing, parcel boundaries, setback distances, and highway road alignments from Autodesk Forma.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Stage 2 — Deterministic Screening Calculations:", "", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(2), Pt(1))
            add_bullet_item(tf, "• Acoustic Screening:", "Calculates line-source geometric decay, Maekawa barrier diffraction based on path-length difference δ = (d₁ + d₂ - d) + 0.1 · d_veg, and vegetative buffer absorption.", Pt(10.5), COLOR_HIGHLIGHT, COLOR_BODY, Pt(2), Pt(0), indent=1)
            add_bullet_item(tf, "• Façade Solar Screening:", "Computes peak direct irradiance reduction via orientation angle δ_azimuth and louver projection: I_eff = I₀ · cos(θ_inc) · (1 - 0.28 · L_depth).", Pt(10.5), COLOR_HIGHLIGHT, COLOR_BODY, Pt(2), Pt(0), indent=1)
            add_bullet_item(tf, "• Stormwater Screening:", "Applies the Rational Method Q = (C · I · A) / 360 for peak runoff, 90th percentile design storm sizing V_target = 10 · P_90 · C · A, and SuDS retention sizing.", Pt(10.5), COLOR_HIGHLIGHT, COLOR_BODY, Pt(3), Pt(0), indent=1)
            add_bullet_item(tf, "Stage 3 — Spatial Visualization & Decision Support:", "2.5D SVG canvas dynamically renders acoustic sound contours, solar shading vectors, and stormwater retention volumes with instant proposal delta comparison.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

    # ====================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # ====================================================
    s4 = prs.slides[3]
    for shape in s4.shapes:
        if shape.name == "Title 1" or shape.shape_id == 17409:
            shape.text_frame.text = "FEASIBILITY AND VIABILITY"
            p = shape.text_frame.paragraphs[0]
            p.font.size = Pt(26)
            p.font.bold = True
            p.font.color.rgb = COLOR_PRIMARY
            p.font.name = "Calibri"
            
        elif shape.name == "TextBox 8" or shape.shape_id == 17410:
            shape.left = Inches(0.6)
            shape.top = Inches(1.3)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()
            
            add_section_header(tf, "1. Analysis of Feasibility (Technical, Operational & Economic)", Pt(12.5), COLOR_ACCENT, Pt(0), Pt(2))
            add_bullet_item(tf, "Technical Feasibility:", "Fully implemented and validated working prototype; uses standard web technologies and lightweight microservices with zero specialized GPU hardware required.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Operational Feasibility:", "Sub-50ms execution allows immediate exploratory feedback during live charrettes, client presentations, and municipal review sessions without needing simulation specialists.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Economic Viability:", "Zero costly solver licensing for screening; prevents expensive post-construction architectural modifications and civil drainage rework by resolving issues upfront.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

            add_section_header(tf, "2. Potential Challenges and Risks", Pt(12.5), COLOR_ACCENT, Pt(6), Pt(2))
            add_bullet_item(tf, "Risk 1 (Model Scope Misinterpretation):", "Users mistakenly treating fast screening approximations as statutory regulatory compliance certifications.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Risk 2 (Complex Geometric Edge-Cases):", "Non-linear acoustic canyon reflections or highly irregular multi-parcel site boundaries.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Risk 3 (Forma Sync Latency):", "Network serialization overhead during large-scale mesh exchanges between Forma cloud and extension iframe.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

            add_section_header(tf, "3. Strategies for Overcoming Challenges", Pt(12.5), COLOR_ACCENT, Pt(6), Pt(2))
            add_bullet_item(tf, "Clear Boundary Labeling & Verification Checklist:", "Prominent UI badges explicitly direct users to Forma's native analyses (Wind, Microclimate, Sun Hours) and EnergyPlus/SWMM for detailed statutory validation.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Empirical Calibration & Safety Factors:", "Equations calibrated against ISO 9613-2 and ASHRAE 90.1 empirical benchmarks to ensure dependable screening bounds.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Optimized Client Bounding-Box Serialization:", "Client-side geometry simplification, debounced REST endpoints, and local state caching ensure zero-lag slider manipulation.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

    # ====================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # ====================================================
    s5 = prs.slides[4]
    for shape in s5.shapes:
        if shape.name == "Title 1" or shape.shape_id == 17409:
            shape.text_frame.text = "IMPACT AND BENEFITS"
            p = shape.text_frame.paragraphs[0]
            p.font.size = Pt(26)
            p.font.bold = True
            p.font.color.rgb = COLOR_PRIMARY
            p.font.name = "Calibri"
            
        elif shape.name == "TextBox 8" or shape.shape_id == 17410:
            shape.left = Inches(0.6)
            shape.top = Inches(1.3)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()
            
            add_section_header(tf, "1. Potential Impact on Target Audience", Pt(12.5), COLOR_ACCENT, Pt(0), Pt(2))
            add_bullet_item(tf, "Target Beneficiaries:", "Urban Planners, Architects, Municipal Development Authorities (Smart Cities Mission), Environmental Engineers, and Real Estate Developers using Autodesk Forma.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Workflow Acceleration:", "Reduces early environmental screening cycle time from 5–10 business days to under 60 seconds per site layout revision.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

            add_section_header(tf, "2. Demonstrated Multi-Hazard Benefits (Karunya Nagar Smart City Benchmark)", Pt(12.5), COLOR_ACCENT, Pt(6), Pt(2))
            add_bullet_item(tf, "Acoustic Relief (Social / Health):", "Baseline highway noise reduced from 78.0 dBA down to 62.94 dBA (Improved Exposure, -15.05 dB reduction) via 3.5m berm and 8m vegetative buffer; protects residential wellness along transit corridors.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Solar Thermal Relief (Economic / Energy):", "Peak façade solar heat reduced from 710.0 W/m² to 482.8 W/m² (-32.0% solar load relief) via -18° orientation offset and 1.2m louvers; decreases peak HVAC cooling sizing and operational energy by 20–30%.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Stormwater Retention (Environmental / Resilience):", "Runoff retention capacity boosted to 82.0% (7,800 m³ retention storage + 644m bioswales), mitigating flash flood and topsoil erosion risks during 50-year monsoon events (I = 65 mm/hr).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Composite Resilience Index Jump:", "Overall site resilience score advances from 48 / 100 (Grade D) in Baseline to 87 / 100 (Grade A, +39 point improvement) in Resilient Proposal.", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

    # ====================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # ====================================================
    s6 = prs.slides[5]
    for shape in s6.shapes:
        if shape.name == "Title 1" or shape.shape_id == 17409:
            shape.text_frame.text = "RESEARCH AND REFERENCES"
            p = shape.text_frame.paragraphs[0]
            p.font.size = Pt(26)
            p.font.bold = True
            p.font.color.rgb = COLOR_PRIMARY
            p.font.name = "Calibri"
            
        elif shape.name == "TextBox 8" or shape.shape_id == 17410:
            shape.left = Inches(0.6)
            shape.top = Inches(1.3)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()
            
            add_section_header(tf, "1. Authoritative Technical Standards & Literature", Pt(12.5), COLOR_ACCENT, Pt(0), Pt(2))
            add_bullet_item(tf, "Acoustic Engineering:", "ISO 9613-2:1996 (Acoustics — Attenuation of sound during propagation outdoors); Maekawa, Z. (1968), Noise reduction by screens, Applied Acoustics, 1(3); CPCB National Ambient Noise Quality Standards (India).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Solar Radiation & Building Physics:", "ASHRAE Handbook of Fundamentals (Fenestration Solar Heat Gain & Shading Coefficients); Duffie, J.A. & Beckman, W.A., Solar Engineering of Thermal Processes (Wiley); NBC 2016 (National Building Code of India).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Stormwater Management & SuDS:", "MoHUA CPHEEO Manual on Stormwater Drainage Systems (Govt. of India); CIRIA C753 The SuDS Manual (Water Sensitive Urban Design); Rational Method Runoff Peak Flow Equation (Q = C·I·A / 360).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

            add_section_header(tf, "2. Platform Integration, Benchmark Site & Open Source Repository", Pt(12.5), COLOR_ACCENT, Pt(6), Pt(2))
            add_bullet_item(tf, "Autodesk Forma Developer Platform:", "Autodesk Forma Web SDK, Extension Architecture & REST API Documentation (https://aps.autodesk.com).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Demonstration Site Coordinates:", "Karunya Nagar Smart City Benchmark, Coimbatore South, Tamil Nadu (10.9366° N, 76.7441° E, 1.2 km² / 120 ha site along NH-544 / Siruvani Road corridor).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(3), Pt(1))
            add_bullet_item(tf, "Open Source Project Repository:", "GitHub Codebase: https://github.com/jenisia-tech/ResiliForma (FastAPI Backend + React/TypeScript Frontend with full test suite).", Pt(11), COLOR_PRIMARY, COLOR_BODY, Pt(4), Pt(1))

    # ----------------------------------------------------
    # Handle Slide 7 (Instructions slide) - Remove to adhere to max 6 slides rule
    # ----------------------------------------------------
    if len(prs.slides) > 6:
        rId = prs.slides._sldIdLst[6].rId
        prs.part.drop_rel(rId)
        del prs.slides._sldIdLst[6]
        print("Removed Slide 7 (Instructions note) to satisfy official SIH 6-slide rule.")

    # Save output to both target paths
    out_paths = [
        "/Users/Chris David/Documents/SIH/ResiliForma-SIH2026-Presentation.pptx",
        "/Users/Chris David/Documents/SIH/SIH2026-IDEA-Presentation-Format.pptx"
    ]
    for out_path in out_paths:
        prs.save(out_path)
        print(f"Saved updated presentation to: {out_path}")

if __name__ == "__main__":
    build_presentation()
