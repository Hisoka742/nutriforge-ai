from app.schemas.workout_schemas import Supplement, SupplementPlan


def get_supplement_plan(
    gender: str,
    goal: str,
    age: int,
    diet_style: str = "none",
    weight_kg: float = 70,
) -> SupplementPlan:

    supplements = []

    supplements.append(Supplement(
        name="Vitamin D3",
        dose="2,000 IU",
        timing="With breakfast (fat-containing meal)",
        reason="Most people are deficient. Supports muscle function, immunity, and mood.",
        priority="essential",
    ))

    supplements.append(Supplement(
        name="Omega-3 fish oil",
        dose="1-2g EPA+DHA",
        timing="With meals",
        reason="Reduces inflammation, supports heart health and joint recovery from training.",
        priority="essential",
    ))

    if goal in ("muscle_gain", "fat_loss", "athlete"):
        protein_dose = f"{round(weight_kg * 0.3)}g"
        supplements.append(Supplement(
            name="Whey protein isolate",
            dose=protein_dose,
            timing="Within 30 minutes post-workout",
            reason="Supports muscle protein synthesis. Helps hit daily protein targets easily.",
            priority="essential" if goal == "muscle_gain" else "recommended",
        ))

    if goal in ("muscle_gain", "athlete"):
        supplements.append(Supplement(
            name="Creatine monohydrate",
            dose="5g",
            timing="Any time daily (consistency matters more than timing)",
            reason="Most researched supplement in sports nutrition. Increases strength and power output.",
            priority="essential",
        ))

    if gender == "female":
        supplements.append(Supplement(
            name="Iron",
            dose="18mg (with 500mg Vitamin C)",
            timing="Morning, away from calcium-rich foods",
            reason="Women lose iron through menstruation. Deficiency causes fatigue and poor performance.",
            priority="essential",
        ))

        if age >= 35:
            supplements.append(Supplement(
                name="Calcium + Vitamin K2",
                dose="500mg calcium / 100mcg K2",
                timing="With dinner",
                reason="Bone density protection becomes important for women over 35.",
                priority="recommended",
            ))

        if goal == "fat_loss":
            supplements.append(Supplement(
                name="Magnesium glycinate",
                dose="300mg",
                timing="Before bed",
                reason="Supports sleep quality, reduces cortisol, eases PMS symptoms.",
                priority="recommended",
            ))

    if gender == "male":
        supplements.append(Supplement(
            name="Zinc",
            dose="15mg",
            timing="With dinner",
            reason="Supports testosterone production and immune function.",
            priority="recommended",
        ))

    if diet_style in ("vegan", "vegetarian"):
        supplements.append(Supplement(
            name="Vitamin B12",
            dose="1,000mcg (methylcobalamin)",
            timing="Morning",
            reason="B12 is found almost exclusively in animal products. Essential for plant-based eaters.",
            priority="essential",
        ))
        supplements.append(Supplement(
            name="Algae-based Omega-3 (DHA/EPA)",
            dose="250-500mg DHA",
            timing="With meals",
            reason="Replaces fish oil for plant-based eaters. Algae is the original source of omega-3.",
            priority="essential",
        ))

    if goal == "fat_loss":
        supplements.append(Supplement(
            name="Caffeine",
            dose="100-200mg",
            timing="30-60 minutes before workout",
            reason="Proven to increase fat oxidation during exercise and improve training performance.",
            priority="optional",
        ))

    notes = (
        "Always get bloodwork done before starting iron or vitamin D supplements to confirm deficiency. "
        "Look for third-party tested brands (NSF or Informed Sport certified). "
        "Supplements support a good diet, they do not replace it."
    )

    return SupplementPlan(supplements=supplements, notes=notes)