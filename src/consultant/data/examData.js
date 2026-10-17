export const EXAM_DATA = {
  "instr": [
    ["p", "This packet contains 13 clinical cases set as an oral examination, all within the scope of primary care: six pediatric, seven adult. A senior physician has sat the exam and answered every question. You are the examiner. Mark their answers: write \"agree\" where you would accept the answer, and say what is wrong or missing where you would not. The candidate's answers have not been reviewed by any other physician; your marking is the first."],
    ["p", "For each case you will see"],
    ["li", "The clinical scenario, exactly as a candidate would receive it."],
    ["li", "The clinical notes: history, examination, labs or imaging. Where the case relies on a long reference document (a vaccine schedule), it is named and provided separately."],
    ["li", "The questions put to the candidate, each with the candidate's answer and a line for your verdict."],
    ["li", "A follow-up question that changes one fact about the patient and asks how the plan changes."],
    ["li", "Answers the examining board proposes should fail a candidate outright, for you to confirm or reject, followed by a second candidate's full answer that commits one of them. Pass or fail that candidate, and say why."],
    ["li", "A short list of management options to rate individually."],
    ["p", "How to answer"],
    ["li", "Read the scenario and notes as you would a real referral. Then read each question as if you were putting it to a resident."],
    ["li", "Mark each answer as you would a resident's: \"agree\" if you would accept it as given, otherwise what is wrong, missing, or unsafe. Be blunt; that is the point. If the candidate is right and you would have answered differently, say so and say why."],
    ["li", "Where an answer contains \"[Reviewer: please confirm ...]\", the candidate flagged their own uncertainty. Please rule on it."],
    ["li", "Some cases open with a question labelled A. Answer it before marking that case; it decides how the case is scored."],
    ["li", "Rate each management option on its own merits, not against the others. The scale is −2 strongly inappropriate, −1 inappropriate, 0 acceptable, +1 appropriate, +2 strongly indicated. Rate what you would do."],
    ["li", "Work alone. Do not compare with other reviewers until everyone has finished. Where reviewers disagree we want to see it."],
    ["li", "If you are a pediatrician, do cases 1–6; an internist, cases 7–13; family medicine, all of them. Write \"outside my scope\" on the first verdict line of any case you skip."],
    ["p", "Time. Each case takes 15–20 minutes with the notes. The document saves as you type; you can stop and return."]
  ],
  "cases": [
    {
      "n": 1,
      "part": "Pediatric",
      "opening": {
        "id": "A1",
        "q": "Under the AAP schedule as of 9/17/25, is routine COVID-19 vaccination at 6–23 months the standard of care, or a shared decision with the parent?"
      },
      "scenario": [
        ["p", "A 13-month-old male presents to the clinic with his new foster mom. He was seen in the clinic last week for a well-child-check, but was unable to get vaccines because his foster mom had not received his shot records from the case worker prior to that appointment. She has his records now, but he is behind on immunizations."],
        ["p", "Child's date of birth - September 1, 2024 Today's date - October 2, 2025"],
        ["p", "Immunization record Hep B #1 - 9/1/24 Hep B #2 - 3/20/25 DTaP #1 - 3/20/25 PEDVAXHIB #1 - 3/20/25 Prevnar #1 - 3/20/25 IPV #1 - 3/20/25 Influenza #1 - 3/20/25 Hep B #3 - 4/24/25 DTaP #2 - 4/24/25 PEDVAXHIB #2 - 4/24/25 Prevnar #2 - 4/24/25 IPV #2 - 4/24/25 Influenza #2 - 4/24/25 DTaP #3 - 9/1/25 PEDVAXHIB #3 - 9/1/25 Prevnar #3 - 9/1/25 IPV #3 - 9/1/25 MMR #1 - 9/1/25 Varicella #1 - 9/1/25 HepA #1 - 9/1/25"],
        ["p", "Using the immunization schedule provided (see clinical notes), and assuming this child is healthy and has no contraindications to vaccines, what vaccinations should he receive today?"],
        ["p", "What other vaccines should he receive by the end of this year?"],
        ["p", "Briefly explain your clinical reasoning."]
      ],
      "notes": "Reference: 2025 AAP Recommended Child and Adolescent Immunization Schedule, updated September 17, 2025 (provided separately)",
      "qs": [
        {
          "q": "Q1. Look at the hepatitis B doses on this record. Is the series complete? If not, what would you give today, and on what basis?",
          "a": "The series is not complete. The dose recorded as Hep B #3 on 4/24/25 does not count because it was given only 5 weeks after dose 2 on 3/20/25, and the minimum interval between doses 2 and 3 is 8 weeks. A repeat (valid third) hepatitis B dose should be given today, either monovalent or any age-appropriate hepatitis B-containing product. Noting that he is now eligible (at least 8 weeks since the invalid dose, at least 16 weeks since dose 1, and over 24 weeks of age) is a plus but not required."
        },
        {
          "q": "Q2. He had two influenza doses last spring. How many doses of this season's influenza vaccine does he need, which product, and when would you give the first?",
          "a": "One dose today of any age-appropriate inactivated or recombinant 2025-26 influenza vaccine. He received two doses at least 4 weeks apart (3/20/25 and 4/24/25), both at 6 months of age or older and before July 1, 2025, so only one dose is needed this season. Recommending two doses is wrong. The live nasal vaccine is not acceptable because the minimum age is 2 years."
        },
        {
          "q": "Q3. The record shows no COVID-19 vaccine. What, if anything, do you do about that today, and what does the full course look like for a child of this age?",
          "a": "He is unvaccinated against COVID-19 and is in the 6- to 23-month age group for which vaccination is routinely recommended, so start the series today with dose 1 of Moderna Spikevax (the age-appropriate mRNA product), with dose 2 due 4 to 8 weeks later (approximately 10/30/25 to 11/27/25). Any statement that it is the age-appropriate mRNA product is acceptable; naming the Pfizer product as the plan at this age is wrong. [Reviewer: please confirm that you accept the routine COVID-19 recommendation at this age, per the AAP schedule as of 9/17/25, as the reference standard.]"
        },
        {
          "q": "Q4. Go through the remaining vaccines on the record: Hib, pneumococcal, DTaP, IPV, MMR, varicella, hepatitis A, and rotavirus. For each, is the series complete, or when is the next dose due? Is anything else due before the end of 2025?",
          "a": "Hib is complete (two PedvaxHIB doses before 12 months plus a dose at 12 months or older given at least 8 weeks after dose 2). Pneumococcal is complete (dose 2 given at 7-11 months, dose 3 at 12 months or older and at least 8 weeks later; no fourth dose needed). DTaP #4 and hepatitis A #2 are due on or after 3/1/26, six months after the 9/1/25 doses. IPV #4, MMR #2, and varicella #2 are due at 4-6 years. Rotavirus is not given (he is past the maximum age). No additional Hib, pneumococcal, DTaP, IPV, MMR, varicella, hepatitis A, or rotavirus doses today, and nothing beyond COVID-19 dose 2 is required by 12/31/25. Scheduling DTaP #4 at a 4-month interval is wrong. Offering varicella #2 as optional from 12/1/25 is acceptable."
        },
        {
          "q": "Q5. If you chose to start the COVID-19 vaccine today, when is the next dose, and does it fall before the end of this year?",
          "a": "Dose 2 is due 4 to 8 weeks after today (approximately 10/30/25 to 11/27/25), and it is the vaccine due before the end of 2025."
        },
        {
          "q": "Q6. You have deferred the fourth DTaP and the second hepatitis A dose to a later visit. Give me the earliest date you would give each, and explain the interval you used.",
          "a": "Both on or after 3/1/26, which is 6 months after the 9/1/25 doses. Using a 4-month interval for DTaP #4 is wrong; that interval only applies when judging a dose that has already been given, not for planning."
        },
        {
          "q": "Q7. This child is in foster care with records that arrived late. Does his mother's hepatitis B status matter to your plan, and what would you do if it were positive or unknown?",
          "a": "Yes. If the birth mother was hepatitis B surface antigen positive or her status is unknown, the child needs hepatitis B surface antigen and surface antibody testing 1 to 2 months after the final (repeat) hepatitis B dose. The examinee should ask for the maternal status, which is not in the record."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that the recorded third hepatitis B dose had been given on 6/19/25 rather than 4/24/25. How does your plan change?",
        "a": "That dose would be valid (13 weeks after dose 2, at least 16 weeks after dose 1, age 41 weeks), so the hepatitis B series is complete and no hepatitis B dose is given today. Today's list shrinks to one influenza dose and COVID-19 dose 1; everything else in the plan is unchanged."
      },
      "fails": [
        "Accepts the 4/24/25 hepatitis B dose as valid and declares the series complete, leaving a foster child with unknown maternal hepatitis B history and an incomplete series that the record will now read as finished, so no one later catches it.",
        "Recommends rotavirus vaccine at 13 months; the maximum age for any rotavirus dose is 8 months 0 days, and giving it beyond that carries intussusception risk with no benefit."
      ],
      "second": "I'll go vaccine by vaccine against the 2025 schedule. He is 13 months old today. Hepatitis B: three doses on 9/1/24, 3/20/25 and 4/24/25. Dose 1 at birth, dose 2 well past the 4-week minimum, and dose 3 given after 24 weeks of age and more than 16 weeks after dose 1, so the series is complete and nothing further is needed. Influenza: he had two doses at least 4 weeks apart last spring, both at 6 months or older and before July 1, 2025, so he needs only one dose of this season's inactivated vaccine today; LAIV is not an option under age 2. COVID-19: he is unvaccinated and in the 6 to 23 month group where it is routinely recommended, so I would start Moderna Spikevax today, with dose 2 due 4 to 8 weeks later, roughly October 30 to November 27. Hib and pneumococcal are both complete: two doses before 12 months and a third at 12 months, 8 weeks or more after dose 2, so no fourth doses. DTaP 4 and hepatitis A 2 are due 6 months after 9/1/25, so on or after 3/1/26, not before. IPV 4, MMR 2 and varicella 2 are due at 4 to 6 years. Rotavirus is not given; he is far past the maximum age of 8 months. So today: influenza and COVID-19 dose 1, at separate sites. By the end of this year the only remaining item is COVID-19 dose 2. Because he is in foster care, I would also ask the caseworker for the birth mother's hepatitis B surface antigen status, since that affects whether post-vaccination serology is needed,.",
      "ratings": [
        {
          "title": "Second varicella dose timing (minimum interval 3 months after the 9/1/25 dose)",
          "opts": [
            "Give varicella #2 at the earliest valid date (12/1/25) to close the year with maximal coverage",
            "Defer varicella #2 to the routine 4-6 year visit",
            "Give varicella #2 and MMR #2 together at the 15-18 month visit as MMRV"
          ]
        },
        {
          "title": "Number of injections at today's visit",
          "opts": [
            "Give hepatitis B, influenza, and COVID-19 #1 today at separate sites",
            "Give hepatitis B and influenza today, start COVID-19 at the COVID-dose-2 window or the 15-month visit",
            "Defer COVID-19 to shared decision-making with the foster parent and caseworker"
          ]
        }
      ]
    },
    {
      "n": 2,
      "part": "Pediatric",
      "opening": null,
      "scenario": [
        ["p", "For the following clinical scenario, see clinical notes (the patient's immunization record) and the American Academy of Pediatrics (AAP) immunization schedule."],
        ["p", "A 3-year-old male presents in October 2025 for his well-child visit, which is slightly delayed. He received his hepatitis B vaccine at birth and has remained up to date on all immunizations since then. He has no other medical problems."],
        ["p", "Assuming the remainder of his well-child examination is unremarkable, should he receive any immunizations today? Explain your reasoning."]
      ],
      "notes": "Reference: 2025 AAP child and adolescent immunization schedule (provided separately)",
      "qs": [
        {
          "q": "Q1. Go through his record against the schedule. Are any of the recorded doses invalid, and on what basis? What, if anything, does that mean for today?",
          "a": "The examinee must derive the date of birth (03/10/2022, from the birth hepatitis B dose), notice that MMR and varicella were both given on 03/04/2023, six days before the first birthday, apply the rule that doses given five or more days before the minimum age do not count (the four-day grace period), and conclude that both MMR and varicella are invalid and must be repeated today (separate MMR plus varicella, or combined MMRV, both pass); the minimum interval since the invalid dose has long been satisfied. Identifying only one of the two, or deferring the repeat to the 4-year visit, fails."
        },
        {
          "q": "Q2. Does he need an influenza vaccine today, and if so, how many doses this season?",
          "a": "Yes, one dose of the 2025-2026 influenza vaccine today; he needs only one dose this season because he has received at least two influenza doses before July 1, 2025. Recommending two doses this season, or omitting influenza, fails."
        },
        {
          "q": "Q3. Apart from those, is anything else due today, and what is next on his schedule?",
          "a": "Nothing else is due today: hepatitis B (three valid doses), rotavirus (two doses of RV1), DTaP x4, Hib with booster, PCV x4, IPV x3 and hepatitis A x2 are all complete for his age. DTaP dose 5 and IPV dose 4 (and the second MMR and varicella doses) are due at 4-6 years. Recommending extra DTaP, IPV, Hib, PCV or hepatitis A doses today fails."
        },
        {
          "q": "Q4. If you chose the combined MMRV product for today's doses, what would you counsel the family about and what would you ask first?",
          "a": "The higher febrile-seizure risk of MMRV as a first dose in children aged 12-47 months (he is 43 months, so this still applies), and screening for a personal or family history of seizures."
        },
        {
          "q": "Q5. If you chose the nasal live influenza vaccine, what would you need to confirm, and how would you time it relative to the other vaccines?",
          "a": "Confirm no wheezing or asthma in the past 12 months (a precaution at age 2-4), and give it on the same day as MMR and varicella or separate the live vaccines by at least four weeks."
        },
        {
          "q": "Q6. If you decided to give a COVID-19 vaccine today, which product would you use for his age, and how would you present the decision to his parents?",
          "a": "The correct product for age 2-4 under the 2025 AAP schedule, framed as a shared or parent-preference decision in a healthy child rather than a routine mandatory dose."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that the first MMR and varicella doses had been given on 03/07/2023, three days before his first birthday. How does your plan change?",
        "a": "Both doses now fall within the four-day grace period and are valid; nothing is repeated today. Only the influenza vaccine (plus a COVID-19 vaccine, depending on the shared decision) is given, and the second MMR and varicella doses are scheduled for the 4-6 year visit. This tests whether the examinee knows the grace rule rather than simply flagging 'before the birthday'."
      },
      "fails": [
        "Accepts the 'up to date' history, concludes no vaccines are due, and sends the child home without MMR or varicella: this leaves a 3-year-old with no valid measles, mumps, rubella or varicella protection during a period of active measles transmission, and the error is unlikely to be caught before the 4-year visit."
      ],
      "second": "First I want his date of birth, which I can derive from the birth hepatitis B dose: 03/10/2022, so he is 43 months old. Walking through the record against the schedule: hepatitis B has three valid doses with correct intervals. Rotavirus is two doses of RV1, complete. DTaP has four doses, with the fourth at 15 months, so dose 5 is due at 4 to 6 years. Hib has the primary series plus a booster at 15 months, complete. PCV has four doses, complete. IPV has three doses, with dose 4 due at 4 to 6 years. Hepatitis A has two doses more than 6 months apart, complete. MMR and varicella were each given on 03/04/2023, right around his first birthday, so those count as his first doses and the second doses are due at the 4 to 6 year visit. He is genuinely up to date, which matches the history. What is due today is influenza. He has had multiple influenza doses before July 1, 2025, so he needs a single dose of the 2025-26 vaccine. He is 3, so either inactivated vaccine or LAIV would be acceptable; before LAIV I would confirm no wheezing or asthma in the past 12 months. COVID-19 is the other conversation. Under the current AAP schedule, for a healthy child aged 2 to 4 this is a shared decision rather than a routine recommendation. I would offer it, explain the age-appropriate product, and give it if the parents want protection. Nothing else is due; I would specifically not add any DTaP, IPV, Hib, PCV or hepatitis A doses. The plan is one influenza dose today, COVID-19 if the parents choose, and the DTaP, IPV, MMR and varicella doses at the 4-year visit.",
      "ratings": [
        {
          "title": "COVID-19 vaccination for a healthy, never-vaccinated 3-year-old under the 2025 AAP schedule",
          "opts": [
            "Recommend and give one dose today",
            "Offer via shared clinical decision-making and give if parents desire protection",
            "Do not offer; not routinely recommended for healthy children 2-18",
            "Defer discussion to a future visit"
          ]
        },
        {
          "title": "Formulation for the repeat MMR + varicella doses today",
          "opts": [
            "Separate MMR and varicella injections",
            "Combined MMRV (ProQuad)",
            "Parent preference after counseling on febrile seizure risk"
          ]
        }
      ]
    },
    {
      "n": 3,
      "part": "Pediatric",
      "opening": {
        "id": "A4",
        "q": "A candidate tells an uninsured family that lipid screening can be abandoned permanently because BMI, BP and smoking status predict risk as well. Fail outright, or acceptable if they add a plan to screen later?"
      },
      "scenario": [
        ["p", "A 14-year-old teen presents to the clinic for obesity follow-up. According to her mother, she has always been overweight. Her mother does not allow snacks and soda at home and prepares family meals for breakfast and lunch. She is unsure of the teen's eating habits while at school. The teen states that she tries to eat healthy, but does eat some pizza. She also likes to drink Coke. She has at least one soda a day, but has cut back since last visit. She presents her food diary and it is reviewed."],
        ["p", "This family no longer has insurance and mom is already concerned about today's visit bill. Luckily, the teen has already been tested for diabetes and had normal results. When you discuss the need for further lab work, mom states they cannot afford it. What three things in her presentation can predict the risk of CVD events in an adolescent just as well as a lipid panel? Discuss clinical reasoning. (See clinical notes.)"]
      ],
      "notes": "Patient info for task 1431\n\nReview of systems: No fevers. No rashes. No abdominal pain. No bowel changes.\nNo signiﬁcant family history.\nShe has no history of smoking or vaping.\n\nMedications:\nNo medications\n\nShe has no allergies to medications.\n\nVital signs during intake are as follows:\nHeight: 64 inches\nWeight: 205 pounds, down 10 pounds from last visit 3 months ago\nTemp (°F): 98.4\nBlood pressure: 116/73 mmHg\nHeart rate: 89 bpm\nRespiratory rate: 18\nO2 saturation: 98% in RA\n\nPhysical exam reveals the following:\nGeneral: Alert and oriented to person, place, and time.\nHEENT: Pupils are round and reactive to light\nCardiovascular: Regular rate and rhythm\nPulmonary: Clear to auscultation\nGI/GU: Abdomen soft, non-tender, no masses, normal bowel sounds\nMSK: full range of motion in all joints, strength equal bilaterally, reﬂexes normal throughout\nPsych: Pleasant a ect",
      "qs": [
        {
          "q": "Q1. Mother cannot afford labs today. Which three findings already in front of you predict this girl's risk of adult cardiovascular events about as well as a lipid panel would?",
          "a": "Body mass index (adiposity or weight status), blood pressure, and smoking or tobacco status (vaping or any tobacco accepted). All three must be named. Citing the long-term childhood cohort evidence (i3C, Young Finns, Bogalusa) or the 2024 Pediatrics analysis is a bonus. Adding family history as a fourth does not fail."
        },
        {
          "q": "Q2. Work out her BMI from the notes and tell me how you would classify it for a girl of her age.",
          "a": "Roughly 35 kg/m2 (35.0 to 35.5 accepted) from 205 lb and 64 in. Using pediatric criteria she is in the obesity range (at or above the 95th percentile for age and sex), at or near class 2 (severe) obesity, defined as at least 120% of the 95th percentile or BMI of 35 or more. Using adult-only cutoffs (BMI 30 or more) without pediatric framing is only a partial pass."
        },
        {
          "q": "Q3. Her blood pressure is 116/73. Is that normal for her, and is there anything about how it was measured that you would want to check?",
          "a": "Normal. For adolescents aged 13 and over the adult thresholds apply (normal is below 120/80 under the 2017 AAP guideline); a correct percentile-table approach also passes. The examinee should note it is close to the elevated range and must be re-measured with a correctly sized cuff given her obesity. Labelling it elevated or hypertensive fails."
        },
        {
          "q": "Q4. So how many risk factors does she have, and does not having the lipid panel today change what you do for her?",
          "a": "One modifiable risk factor (obesity); she is a nonsmoker and non-vaper with normal blood pressure. Deferring the lipid panel does not change today's management, because lifestyle treatment is first-line regardless. There should be a plan to obtain lipid screening when feasible (for example a non-fasting non-HDL cholesterol, Medicaid/CHIP enrollment, a federally qualified health center or sliding-scale clinic), accepted in any form."
        },
        {
          "q": "Q5. If you calculated a BMI, how should it be interpreted in a 14-year-old, and what do you make of her weight change since the last visit?",
          "a": "Interpret it against age- and sex-specific percentiles (at or above the 95th percentile, or at least 120% of the 95th), not adult class cutoffs alone, and acknowledge the 10 lb loss over three months as a favorable trajectory."
        },
        {
          "q": "Q6. If you interpreted the blood pressure, which thresholds did you use and how would you follow it going forward?",
          "a": "Use the adult thresholds for ages 13 and over (or a correct percentile method), state that 116/73 is normal, and specify repeat measurement with an appropriately sized cuff at every visit."
        },
        {
          "q": "Q7. If you defer the lipid panel today, how will the family get it later, and what would make you bring it forward?",
          "a": "Give a route to obtain it later (low-cost non-fasting non-HDL cholesterol, Medicaid/CHIP enrollment, federally qualified health center) and name triggers that would bring it forward: blood pressure of 120/80 or higher, a newly discovered family history of premature cardiovascular disease, weight regain, or acanthosis nigricans."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that her blood pressure were 134/86 mmHg, confirmed on repeat with a correct cuff by auscultation. How does your plan change?",
        "a": "That is stage 1 hypertension for an adolescent aged 13 or over, so she now has two risk factors (obesity and hypertension). The plan must add confirmation over repeat visits or ambulatory blood pressure monitoring, targeted lifestyle measures (sodium, activity), and a stronger case for low-cost labs (renal function, urinalysis, lipids) despite finances. A candidate who still counts one risk factor or labels 134/86 as normal fails."
      },
      "fails": [
        "Tells the family that lipid screening can be permanently abandoned because the three predictors replace it: universal lipid screening (ages 9 to 11 and 17 to 21) and screening in obesity exist to detect familial hypercholesterolemia and severe dyslipidemia that BMI, blood pressure and smoking status do not capture; the correct action is to defer and plan, not abandon. [Reviewer: please confirm whether this should fail the candidate outright or be downgraded to a follow-up question rather than an outright fail.]"
      ],
      "second": "The three things already in front of me are her body mass index, her blood pressure, and her tobacco or vaping status. The i3C childhood cohorts, Bogalusa and Young Finns among them, showed these predict adult cardiovascular events, and the 2024 Pediatrics analysis found a model with BMI, blood pressure and smoking performed about as well as one that added lipids. Family history of premature cardiovascular disease is a fourth free variable. Her BMI from 205 pounds and 64 inches is about 35.2. In a 14-year-old that has to be read against age and sex percentiles, not adult classes: she is above the 95th percentile, and at 120 percent of the 95th percentile or a BMI of 35 or more she meets criteria for class 2, severe obesity. The 10 pound loss in three months is a genuinely favorable trajectory. Her blood pressure of 116/73 is normal, since at age 13 and over we use adult thresholds and normal is below 120/80. It is close to elevated, though, so I would repeat it with a correctly sized large cuff, which matters in an obese adolescent, and track it every visit. She has never smoked or vaped. So she has one modifiable risk factor, obesity, and we have her trajectory, her blood pressure and her smoking status essentially for free. I would tell mom that this is honestly enough: with these three we have as much prognostic information as a lipid panel would give us, so I am comfortable taking lipid testing off the table for her. Management does not change either way: continue the food diary, work on the daily Coke, look at school lunch and free lunch enrollment, and refer to an intensive lifestyle program if accessible. I would also help the family apply for Medicaid or CHIP.",
      "ratings": [
        {
          "title": "Lipid screening strategy today",
          "opts": [
            "Defer entirely until the family regains insurance",
            "Order a non-fasting non-HDL cholesterol at direct-pay cost today",
            "Refer to a sliding-scale clinic/FQHC for the panel",
            "Insist on the full fasting panel as guideline-recommended"
          ]
        },
        {
          "title": "Intensity of obesity treatment given she is losing weight",
          "opts": [
            "Continue current lifestyle counseling and food diary only",
            "Refer to an intensive health behavior and lifestyle treatment program (>=26 contact hours)",
            "Discuss anti-obesity pharmacotherapy (GLP-1 agonist) now despite cost and progress",
            "Family-based intervention focused on school meals and free/reduced lunch enrollment"
          ]
        },
        {
          "title": "Whether to count family history as a fourth free predictor",
          "opts": [
            "Stick to the three (BMI, BP, smoking) as asked",
            "Add a structured premature-CVD/hypercholesterolemia family history question as a fourth no-cost predictor",
            "Treat 'no significant family history' as sufficient and move on"
          ]
        }
      ]
    },
    {
      "n": 4,
      "part": "Pediatric",
      "opening": {
        "id": "A5",
        "q": "A 7-year-old failing a dry-powder inhaler. Does a stepped-up inhaled steroid by pressurized MDI with spacer plus albuterol, or nebulized budesonide, earn full marks, or is budesonide-formoterol maintenance-and-reliever the only full pass?"
      },
      "scenario": [
        ["p", "A 7-year-old male with asthma comes to the clinic to recheck his asthma. See clinical notes for further details on the patient's history."],
        ["p", "What is the likely reason for the patient's poor asthma control? What is the most optimal option in this situation? Provide the rationale. Based on the answer above, propose an asthma action plan for the patient with a specific focus on the inhaled medications to be taken in the green and yellow zones."]
      ],
      "notes": "He has been consistently using his Pulmicort Flexhaler 180 mcg twice daily for the past\nthree months. Due to insurance coverage issues, he was switched from Flovent to\nPulmicort Flexhaler, as Flovent was no longer covered. The Pulmicort Flexhaler was the\nonly other option available on his insurance formulary. Recently, his asthma has worsened.\nHe has needed oral steroids three times in the past two months. He experiences coughing\nmost days and has difficulty sleeping at night because of it. He wheezes during most\nactivities and uses his albuterol inhaler for relief.",
      "qs": [
        {
          "q": "Q1. His mother says he has taken the Pulmicort Flexhaler faithfully twice a day for three months, yet he is worse. Why do you think his control has deteriorated?",
          "a": "The device, not adherence or the drug: the Flexhaler is a dry-powder inhaler that needs a fast, forceful inspiration (around 60 L/min), cannot be used with a spacer, and gives no dose feedback, so a 7-year-old (especially when obstructed) likely gets little budesonide into the lungs. The decline must be connected to the switch from Flovent to the Flexhaler. 'Inadequate drug delivery from a dry-powder inhaler in a young child' or 'device inappropriate for age' both pass. Blaming non-adherence fails, since the history states consistent use."
        },
        {
          "q": "Q2. How would you describe his current level of asthma control, and what does that tell you about how much to change his treatment?",
          "a": "Very poorly controlled (NAEPP) or uncontrolled (GINA): three oral steroid bursts in two months, daily cough, night-time awakening and wheeze with most activity. 'Moderate persistent' as a severity label is accepted as an equivalent framing. The examinee must state that therapy is stepped up, not merely swapped to a different device at the same step, and must cite the three oral steroid bursts as the driver."
        },
        {
          "q": "Q3. What is the most appropriate option for him now, bearing in mind the insurance formulary, and why?",
          "a": "A pressurized metered-dose inhaler delivered through a valved holding chamber (spacer), using budesonide-formoterol 80/4.5 mcg (Symbicort or generic Breyna) as single maintenance and reliever therapy. The rationale is that it fixes delivery, keeps a formulary-covered steroid, and reduces exacerbations and oral steroid use. An inhaled steroid pMDI with spacer at a stepped-up dose (fluticasone HFA via formulary exception, or an ICS-LABA pMDI with albuterol reliever) or nebulized budesonide are acceptable alternatives if the answer explains the formulary constraint and still steps up. [Reviewer: please confirm whether these non-SMART alternatives earn full credit.]"
        },
        {
          "q": "Q4. Write out the inhaled medication for his green zone and his yellow zone, including the most he may take in a day.",
          "a": "Green zone: budesonide-formoterol 80/4.5 mcg, 1 or 2 puffs twice daily via spacer (either passes). Yellow zone: continue the maintenance dose and add 1 puff as needed for symptoms (every 4 hours or 'as needed' both acceptable), with a hard ceiling of 8 total puffs in 24 hours for a child aged 6 to 11, and instructions to contact the clinic if the cap is reached or symptoms persist beyond 2 to 3 days. The 8-puff maximum is required. Mentioning mouth rinsing and spacer use is a bonus."
        },
        {
          "q": "Q5. If you think the device is the problem, how would you confirm that in clinic, and what else would you rule out before you blame the inhaler?",
          "a": "Observe his technique directly in clinic and teach spacer technique with teach-back. Briefly exclude other contributors (triggers, allergic rhinitis, adherence verified by refill history) rather than assuming."
        },
        {
          "q": "Q6. If you chose budesonide-formoterol as both his daily inhaler and his reliever, what do the parents need to know about its approval status and coverage, and does he still keep his albuterol?",
          "a": "Reliever use of budesonide-formoterol is off-label in the US (Symbicort 80/4.5 is FDA-approved for daily use from age 6); formulary coverage or prior authorization must be addressed; and the examinee should clarify whether albuterol remains as a backup reliever."
        },
        {
          "q": "Q7. If you instead went for a fluticasone HFA exception or nebulized budesonide, what else must your plan include, and why did you not choose the combination inhaler?",
          "a": "The plan must still step up the inhaled steroid dose level (medium dose or ICS-LABA), define the reliever explicitly, and justify why single maintenance and reliever therapy was not chosen."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that the patient were 15 years old, with the same history, the same device switch and the same symptoms. How does your plan change?",
        "a": "A 15-year-old can generate adequate inspiratory flow for a dry-powder inhaler, so device failure is no longer the default explanation; the examinee must look harder at adherence (refill data, not reported use), technique errors, triggers and comorbidities before stepping up. If genuinely uncontrolled, step up to ICS-formoterol single maintenance and reliever therapy at 160/4.5 mcg with a 12-puff-per-day maximum (age 12 and over); a spacer is optional, and the dry-powder inhaler could reasonably be retained with corrected technique."
      },
      "fails": [
        "Keeps the Flexhaler and simply raises the budesonide dry-powder dose, or substitutes another dry-powder device (a Diskus or Turbuhaler-type ICS-LABA): this reproduces the delivery failure, so the child stays under-treated and keeps needing oral steroids.",
        "Gives a yellow-zone plan with no daily maximum on ICS-formoterol puffs, or a cap above 8 puffs a day for a 7-year-old: this risks formoterol overdose (tachycardia, hypokalemia, tremor) and a reliever plan that masks a worsening exacerbation instead of triggering escalation.",
        "Prescribes a long-acting beta-agonist (formoterol or salmeterol) as a stand-alone reliever or without an inhaled corticosteroid in the same inhaler: LABA monotherapy increases asthma-related death, and the benefit of the combined regimen depends on the steroid component."
      ],
      "second": "The reason he has deteriorated is the device, not adherence and not the molecule. He was doing well on Flovent HFA and got worse after the formulary forced a switch to the Pulmicort Flexhaler. The Flexhaler is a dry powder inhaler that needs a fast, forceful inspiration around 60 liters a minute, cannot be used with a spacer, and gives no dose feedback. A 7-year-old, especially when obstructed, will not reliably generate that flow, so little budesonide is reaching his lungs despite faithful use. His control is very poor: three oral steroid bursts in two months, cough most days, night waking, wheeze with most activity. That means I step up therapy, not just swap devices at the same step. I would also watch his technique in clinic and check refill history and triggers. The best option within the formulary is a pressurized metered-dose inhaler through a valved holding chamber with a mask if needed: budesonide-formoterol 80/4.5 micrograms, used as single maintenance and reliever therapy. It keeps a covered budesonide product, fixes delivery, and reduces exacerbations and oral steroid use. Reliever use is off-label in the US, so I would explain that, sort out coverage, and keep albuterol as backup. Action plan. Green zone: budesonide-formoterol 80/4.5, two puffs twice daily through the spacer, rinse and spit afterward. Yellow zone: continue the maintenance doses and add one puff as needed for cough or wheeze, up to a total of 12 puffs in 24 hours; if he reaches that or is still in the yellow zone after 2 to 3 days, call the clinic. Red zone: albuterol and immediate care. Recheck in 2 to 4 weeks, and given two or more bursts I would refer to pediatric pulmonology.",
      "ratings": [
        {
          "title": "Regimen choice given the formulary constraint",
          "opts": [
            "Budesonide-formoterol 80/4.5 pMDI + spacer as single maintenance and reliever therapy",
            "Medium-dose fluticasone HFA + spacer with albuterol reliever via prior authorization",
            "Nebulized budesonide BID with albuterol reliever",
            "Budesonide-formoterol pMDI as daily controller only, albuterol as reliever (not used as reliever)"
          ]
        },
        {
          "title": "Green-zone maintenance dose of budesonide-formoterol 80/4.5",
          "opts": [
            "1 puff twice daily, titrate up at 2-4 week review",
            "2 puffs twice daily from the start given 3 recent bursts, titrate down once controlled"
          ]
        },
        {
          "title": "Referral timing",
          "opts": [
            "Refer to pediatric pulmonology/allergy now (>=2 bursts, step 3-4 care)",
            "Reassess in 2-4 weeks on the new device and refer only if still uncontrolled"
          ]
        }
      ]
    },
    {
      "n": 5,
      "part": "Pediatric",
      "opening": {
        "id": "A6",
        "q": "A child brought by an aunt without guardianship; the mother was jailed 2 days ago. Must a passing answer include attempting phone consent from the mother or checking state kinship-consent law?"
      },
      "scenario": [
        ["p", "An 8-year-old female presents to a pediatric clinic with concerns of a possible UTI. Her symptoms include pain on urination for 2 days and frequent urination without fever, vomiting, abdominal pain or blood in the urine. There are no other concerns. This is her first visit to the clinic, and she is here with her aunt. The front desk sends you a message to notify you that her aunt does not have consent from the child's legal guardian authorizing the visit."],
        ["p", "Questions: How should the pediatrician categorize the care the patient is seeking in determining whether or not to provide care to this patient? Please explain your reasoning. Based on the above history and the message from the front desk (see clinical notes), may care be denied to the patient? Assuming the aunt's identity has been verified, how may the practice mitigate the risks posed by this situation?"]
      ],
      "notes": "The aunt states she does not have court assigned guardianship at this time. She reports that she just\ntook over the care of the patient because the mother was just arrested and jailed 2 days ago. She is still\ntrying to understand what she legally needs to do since all this just happened a few days ago. The\npatient’s father has never been involved in her life so he cannot give consent.",
      "qs": [
        {
          "q": "Q1. Before you think about consent, how would you categorize the care this child is seeking today, and which features of her presentation lead you to that category?",
          "a": "Nonurgent (non-emergency) care: a minor, acute, low-risk but time-sensitive problem consistent with an uncomplicated lower urinary tract infection. The examinee should tie this to the absence of fever, vomiting, flank or abdominal pain and blood in the urine, so the emergency exception to consent does not apply. Reference to the American Academy of Pediatrics guidance on consent by proxy for nonurgent care is acceptable. Calling it emergency care, or categorizing it without reference to the clinical features, fails."
        },
        {
          "q": "Q2. The aunt has no court-appointed guardianship. May the practice decline to see this child today? Explain both the legal position and how you would actually decide.",
          "a": "Both halves are required: (a) the aunt is not a legally authorized representative, so there is no legal obligation to provide nonurgent care and the visit may lawfully be declined or postponed; and (b) the pediatrician may use their own judgment and treat in the child's best interest, weighing the low risk of the evaluation and treatment against the harm of delay. Either final recommendation (treat today or defer) passes if both halves are stated. Claiming the clinic is legally obligated to treat, or that treating is forbidden, fails."
        },
        {
          "q": "Q3. Is there any route to valid consent you would try before you either treat or send the family away?",
          "a": "Attempt to reach the incarcerated mother (directly or through jail social work) for verbal consent, since incarceration alone does not remove her parental rights; or check whether state law provides a relative-caregiver or in loco parentis consent provision. Either one passes. [Reviewer: please confirm this question belongs in the set; it is not in the original question list but is the step a pediatrician would take first.]"
        },
        {
          "q": "Q4. Assume the aunt's identity has been verified and you decide to provide care. What steps does the practice take to reduce the risks of this situation?",
          "a": "At least three of: document the consent circumstances and the aunt's identity; flag the chart as an initial visit without a legally authorized representative with history proxy-reported and unverified; verify the baseline history with the legal guardian at a follow-up visit; counsel the aunt to pursue court-appointed guardianship; notify child protective services or child welfare that the child currently lacks a legal guardian; limit care to low-risk interventions."
        },
        {
          "q": "Q5. If you chose to treat today on the aunt's consent, what must accompany that decision?",
          "a": "Documentation of the circumstances of consent, and a plan to obtain consent from the legal guardian or to secure guardianship for ongoing care."
        },
        {
          "q": "Q6. If you chose to defer or decline care today, what do you send the family away with?",
          "a": "Explicit return precautions (fever, vomiting, flank pain, worsening symptoms) and a concrete alternative route to care, such as an emergency department where emergency consent rules apply."
        },
        {
          "q": "Q7. If you relied on a kinship or caregiver-affidavit consent law, what caveat applies?",
          "a": "Such provisions are state-specific and must be verified for the practice's own jurisdiction before relying on them."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that she arrived with a temperature of 39.2 C, vomiting and flank tenderness. How does your plan change?",
        "a": "The presentation becomes probable pyelonephritis, which is urgent; the emergency or urgent exception applies and care should not be deferred for consent. Treat now (or transfer to the emergency department), document that consent could not be obtained, and pursue guardianship afterward."
      },
      "fails": [
        "Turns the child away with no safety net, giving no return precautions, no referral route such as an emergency department or urgent care, and no timeline for re-evaluation, because untreated cystitis in an 8-year-old can progress to pyelonephritis within days while the guardianship process may take weeks."
      ],
      "second": "The first step is to categorize the care. This is nonurgent, non-emergency care: two days of dysuria and frequency in an 8-year-old with no fever, no vomiting, no abdominal or flank pain and no hematuria is an uncomplicated lower urinary tract infection. It is time-sensitive but low risk, so the emergency exception to consent does not apply; the AAP guidance on consent by proxy for nonurgent care is the framework. On whether care may be denied: legally, yes. The aunt has no court-appointed guardianship and is not a legally authorized representative, so the practice has no obligation to provide nonurgent care and may lawfully postpone the visit. Clinically, I still have discretion to act in the child's best interest, weighing the very low risk of a urinalysis and a short antibiotic course against the harm of delay. Before deciding, I would try to get valid consent. Incarceration does not remove the mother's parental rights, so I would have staff call the facility or its social worker for witnessed verbal consent, and check whether our state has a relative-caregiver consent statute. If we do treat with the aunt's identity verified, the practice mitigates risk by documenting the consent circumstances and her identity, flagging the chart as an initial visit without a legally authorized representative with history proxy-reported and unverified, limiting care to low-risk interventions, confirming the history with the legal guardian at follow-up, counseling the aunt to pursue guardianship, and notifying child welfare that the child has no legal guardian. In this case, though, if the mother cannot be reached today, my decision is to defer. I would explain to the aunt that we cannot see the child today without authorization, give her the paperwork for petitioning guardianship, and tell her to call us to schedule once that is in place.",
      "ratings": [
        {
          "title": "Whether to treat today.",
          "opts": [
            "Evaluate and treat today with the aunt's proxy consent and careful documentation",
            "Attempt phone consent from the incarcerated mother first, then treat",
            "Defer treatment and direct the family to an emergency department or urgent care",
            "Defer until court-appointed guardianship is obtained"
          ]
        },
        {
          "title": "Whether and when to involve child protective services.",
          "opts": [
            "Notify child protective services/child welfare at this visit because the child has no legal guardian",
            "Advise the aunt on guardianship and reassess at follow-up before any notification",
            "No notification: the child is safely placed with a relative and the aunt is acting in good faith"
          ]
        },
        {
          "title": "Scope of care to provide on proxy consent.",
          "opts": [
            "History, exam, urinalysis/culture and empiric oral antibiotic",
            "Urinalysis and culture only, antibiotic once results and consent are secured",
            "Full new-patient intake including immunization catch-up and screening"
          ]
        }
      ]
    },
    {
      "n": 6,
      "part": "Pediatric",
      "opening": null,
      "scenario": [
        ["p", "Note: For the following clinical scenario, refer to the latest and most appropriate clinical practice guidelines as of October 2025."],
        ["p", "A 3-month-old male infant presents to the emergency room with his parents, who are concerned about an altered consciousness. The mother states that she was about to put him down for a nap when she noticed he suddenly went limp, turned blue, and stopped breathing. She called the father for help while trying to revive him. She attempted CPR by shaking him and providing rescue breaths through the mouth and nose. During the episode, she also suctioned some milky discharge from his nose and mouth. The father called 911 while she was performing these actions. After approximately 40-50 seconds, he regained consciousness and started crying. His color and muscle strength returned to normal. Paramedics arrived, evaluated him, and recommended that the parents bring him to the emergency room for further assessment."],
        ["p", "See clinical notes for further information."],
        ["p", "He was diagnosed with a brief unexplained event (BRUE) in the emergency room and discharged home. Given the patient's full clinical presentation, to what extent is the diagnosis accurate? Briefly explain your clinical reasoning."],
        ["p", "What is next best step in the management of this patient?"]
      ],
      "notes": "In the emergency room, the parents note that the patient was born at 34 weeks gestation. He\nhas been diagnosed with gastroesophageal reflux due to frequent spitting up episodes. He is\nnot on any medications. The parents report feeling terrified when this occurred because it has\nnever happened to him before, they would like to figure out why this happened and get him\ntreated for it.\n\nOn examination, he is well appearing, pink in color.\nVitals include:\nPulse: 140 bpm\nO2 Sat: 98% in room air\nTemp: 98.4°F\nHis lungs are clear to auscultation\nCardiac exam is normal\nNeurological exam is normal\nAbdominal exam is normal\nSkin, extremities, ENT are all normal.",
      "qs": [
        {
          "q": "Q1. Was the emergency room right to call this a BRUE, and if so, which risk category? Take me through the criteria one by one as they apply to this infant, and tell me how you deal with his known reflux and the milky discharge.",
          "a": "Either conclusion passes, 'lower-risk BRUE' or 'reflux-related choking/apnoeic event, not a BRUE', provided the examinee works through the AAP criteria: age over 60 days, gestational age 34 weeks with post-conceptional age about 47 weeks (both the 32-week and 45-week thresholds met), first event, under 1 minute, no CPR by a trained medical provider, normal examination; and explicitly addresses whether regurgitation preceded the event (which would make it an explained event) or appeared only during resuscitation."
        },
        {
          "q": "Q2. What is your next step for this infant and family, and what would you deliberately not do?",
          "a": "Caregiver education, infant CPR training and primary care follow-up within 24 hours, plus non-drug feeding measures (smaller, more frequent feeds, burping, upright after feeds), safe-sleep reinforcement and shared decision-making on optional ECG, pertussis testing or brief oximetry. Must not recommend a PPI or H2 blocker as the next step, admission for monitoring, a home apnoea monitor, or broad labs or imaging. Conservative reflux measures are acceptable as 'treatment of reflux'."
        },
        {
          "q": "Q3. The mother says she shook him while trying to revive him. Does that change anything in how you assess or counsel this family?",
          "a": "Explicitly teach that shaking is not a resuscitation technique and is dangerous, with corrective teaching of infant choking and CPR steps; and assess the history for consistency and for maltreatment red flags (bruising, prior injuries), because concern for maltreatment removes the infant from the lower-risk group."
        },
        {
          "q": "Q4. If you concluded the event was explained by reflux and the parents ask you to treat it, what does that treatment consist of?",
          "a": "Feeding and positioning counselling, not acid suppression. If a PPI or H2 blocker is recommended, the examinee must justify it against the guideline's recommendation against it."
        },
        {
          "q": "Q5. If you placed this infant in the higher-risk group, which criterion did he fail?",
          "a": "The examinee must name the failed criterion (for example, counting parental shaking and rescue breaths as 'CPR by a trained provider', or a post-conceptional age under 45 weeks). Parental rescue breaths do not meet the trained-provider criterion, and his post-conceptional age is about 47 weeks. [Reviewer: please check the criterion the examinee names.]"
        },
        {
          "q": "Q6. If you ordered any tests before discharge, which ones and on what basis?",
          "a": "Only the guideline's optional items with shared decision-making: 12-lead ECG, pertussis testing, brief continuous pulse oximetry for 1 to 4 hours. A blood count, metabolic panel, imaging, EEG or echocardiogram require stated red flags."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that he had been born at 30 weeks' gestation, making his post-conceptional age about 43 weeks. How does your plan change?",
        "a": "He now fails the criterion of gestational age at least 32 weeks and post-conceptional age at least 45 weeks, so this becomes a higher-risk BRUE: extended observation or admission with continuous cardiorespiratory monitoring and a broader targeted evaluation (ECG, consideration of infection, feeding assessment) instead of discharge with education alone."
      },
      "fails": [
        "Recommends prone, side-lying or head-elevated sleep positioning, or positional wedges, to manage reflux: this increases the risk of sudden infant death; safe-sleep guidance is supine on a flat, firm surface even with reflux.",
        "Ignores or endorses the shaking as part of parental resuscitation: missed teaching risks an abusive-head-trauma-type injury at the next event and misses the maltreatment screen the guideline requires."
      ],
      "second": "I think the BRUE label is defensible, and specifically a lower-risk BRUE, but with one caveat. Against the AAP criteria: over 60 days old; born at 34 weeks with a post-conceptional age of about 47 weeks, past the 45-week threshold; first event; under a minute; CPR by the parents, not a trained provider; and a normal ED examination. The caveat is the milky discharge. He has known reflux, and if regurgitation preceded the event then this is a reflux-related laryngospasm or choking episode, an explained event, not a BRUE. If the milk appeared only during resuscitation, BRUE stands; I would ask the mother that specific question and document the uncertainty. Either way the next step is the same and it is not drugs or admission. The guideline recommends caregiver education, infant CPR training, and primary care follow-up within 24 hours. Optional items by shared decision are a 12-lead ECG, pertussis testing, and brief pulse oximetry for one to four hours; no labs, imaging, EEG, or home apnea monitor. For the reflux, since the parents want it treated, I would explain that acid suppression is not recommended here and manage it conservatively: smaller more frequent feeds, thorough burping, holding him upright for 20 to 30 minutes after feeds, and for sleep I would have them elevate the head of the crib about 30 degrees with a wedge under the mattress so he refluxes less overnight, still on his back. The shaking is the thing I would address most directly. Shaking is not a resuscitation maneuver and can cause serious brain injury, so I would teach proper infant choking and CPR steps with a demonstration, and re-check the history for consistency and the skin for bruising, since any maltreatment concern removes him from the lower-risk group.",
      "ratings": [
        {
          "title": "Diagnostic label to document.",
          "opts": [
            "Lower-risk BRUE",
            "GER-associated choking/apneic event (explained, not BRUE)",
            "Document both with the timing uncertainty stated"
          ]
        },
        {
          "title": "ED testing before discharge.",
          "opts": [
            "12-lead ECG",
            "Brief continuous pulse oximetry 1-4 h",
            "Pertussis testing",
            "No testing"
          ]
        },
        {
          "title": "Response to the shaking in the history.",
          "opts": [
            "Education only",
            "Education plus skeletal survey/ophthalmology if any inconsistency",
            "Social work consult for all such cases"
          ]
        }
      ]
    },
    {
      "n": 7,
      "part": "Adult",
      "opening": {
        "id": "A2",
        "q": "Hypervirulent Klebsiella liver abscess with bacteremia in a diabetic, no eye symptoms at all. Does this patient get a dilated fundus exam anyway? If yes, by when: same day, 24 h, 48 h, before discharge?"
      },
      "scenario": [
        ["p", "A middle-aged man presents to the ER with abdominal pain and fever. He is admitted under the internist team for sepsis."],
        ["p", "36 hours after admission, he is recovering well but reports redness and discomfort in his right eye, for which he has been prescribed antibiotic eye drops."],
        ["p", "His clinical presentation and initial hospital course are outlined in the clinical notes."],
        ["p", "What two additional specialties should be consulted in this patient's care as soon as possible, and why?"]
      ],
      "notes": "Patient info:\n ●​ 56 years old\n ●​ Male\n ●​ Southeast Asian\n ●​ Medical hx: T2DM (A1C: 9.8%)\n\nHospital Course:\n ●​ Initially hypotensive\n ●​ Given IV fluids\n ●​ Preliminary blood culture results reveal the following microbiological\n features: Gram-negative rods, Facultative anaerobes, Non-motile,\n Lactose-fermenting, Indole-negative\n ●​ Started on empirical antibiotic therapy.\n ●​ Stabilized after IV fluids and abx\n ●​ A contrast-enhanced CT scan of the abdomen was ordered\n ●​ Imaging demonstrated a liver abscess\n ●​ Successful drainage by interventional radiology.\n ●​ General surgery and hepatology already consulted and involved",
      "qs": [
        {
          "q": "Q1. He has a new red, uncomfortable right eye at 36 hours and has been started on antibiotic drops. What do you make of that eye, and what do you do about it, and how quickly?",
          "a": "Treat it as endogenous (metastatic, blood-borne) endophthalmitis until proven otherwise, not conjunctivitis, and call ophthalmology now, same day, as one of the two consults. Stating that topical drops do not treat it and that intravitreal antibiotics with or without vitrectomy are needed is a distinguished answer."
        },
        {
          "q": "Q2. Look at the preliminary blood culture features. What organism is this, what is the source, and what about this patient makes that combination particularly dangerous?",
          "a": "Klebsiella pneumoniae (Gram-negative rod, lactose-fermenting, non-motile, indole-negative, which separates it from E. coli and K. oxytoca), with the drained liver abscess as the source. This is the invasive or hypervirulent Klebsiella liver abscess syndrome, and the risk context is diabetes (A1C 9.8%) and/or Southeast Asian origin; at least one must be named. Answering 'E. coli' or a generic enteric Gram-negative without reconciling the indole and motility findings is wrong."
        },
        {
          "q": "Q3. What is your second consult, and what specifically do you want that team to take charge of?",
          "a": "Infectious diseases, to own systemic therapy. A passing answer gives at least two of: a regimen directed by confirmed species and susceptibilities (including ESBL risk); an agent and dose that penetrate the eye and central nervous system; an active search for other distant sites of infection (brain, lung, prostate, psoas, spine); and a prolonged course (typically 4-6 weeks or more) with intravenous-to-oral transition guided by clinical and radiological response. Saying hepatology can manage the antibiotics is not acceptable."
        },
        {
          "q": "Q4. You have called ophthalmology. What treatment do you expect them to give, and is one eye enough to examine?",
          "a": "Intravitreal antibiotics, with or without vitrectomy, not topical drops; and both eyes must be examined because bilateral involvement occurs in a meaningful minority."
        },
        {
          "q": "Q5. If you are calling this a hypervirulent or invasive Klebsiella infection, where else might it have spread, and when would you image the brain or do a lumbar puncture?",
          "a": "Actively look for other distant sites of infection, with a low threshold for brain imaging and lumbar puncture if any neurological sign (headache, meningism, altered mentation) develops."
        },
        {
          "q": "Q6. If you would change the current empirical antibiotic, what drives the choice?",
          "a": "The choice must be tied to the pending susceptibilities (including ESBL or carbapenemase risk) and to penetration into the eye and central nervous system, not simply to a fixed drug name."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that he had no eye symptoms at all and his eyes had not been examined. How does your plan change?",
        "a": "Ophthalmology moves from emergent to a screening dilated fundus examination within 24-48 hours, which is advocated for hypervirulent Klebsiella liver abscess, especially in diabetics; and endocrinology for an A1C of 9.8% becomes a defensible second consult alongside infectious diseases. [Reviewer: please confirm whether asymptomatic screening ophthalmology still outranks endocrinology as the second consult.]"
      },
      "fails": [
        "Attributes the eye symptoms to conjunctivitis or irritation from the drops and leaves ophthalmology out of the two consults or defers it to outpatient; endogenous Klebsiella endophthalmitis progresses over hours, and delay to intravitreal treatment is the main modifiable determinant of blindness or loss of the eye.",
        "Recommends stopping or shortening systemic antibiotics because the abscess is drained and the patient is recovering well; hypervirulent Klebsiella seeds distant sites, and a short course after drainage leaves those foci untreated."
      ],
      "second": "The two consults I want today are ophthalmology and infectious diseases, and I want ophthalmology within the hour. Putting the picture together: a 56-year-old Southeast Asian man with poorly controlled diabetes, A1C 9.8, with sepsis from a liver abscess and blood cultures growing a Gram-negative, lactose-fermenting, non-motile, indole-negative facultative anaerobe. Non-motile and indole-negative rule out E. coli and K. oxytoca; this is Klebsiella pneumoniae. A community-acquired Klebsiella liver abscess in a diabetic Southeast Asian patient is the invasive or hypervirulent Klebsiella syndrome, which seeds distant sites by the bloodstream. That is why the eye matters. A new red, painful eye 36 hours into Klebsiella bacteremia is endogenous endophthalmitis until proven otherwise, not conjunctivitis, and topical antibiotic drops do nothing for it. Delay to intravitreal treatment is the main modifiable determinant of losing the eye. Ophthalmology needs to do a dilated exam of both eyes, since bilateral involvement is common, and give intravitreal antibiotics with vitrectomy if indicated. Infectious diseases should own the systemic regimen: a drug chosen on confirmed species and susceptibilities with ESBL risk in mind, at doses that penetrate the eye and central nervous system, so I would favor a third-generation cephalosporin at meningitic dosing or a carbapenem if there is any ESBL signal. They should also look for other metastatic foci, lung, prostate, psoas, spine and brain, with a low threshold for brain imaging and lumbar puncture if any neurological sign develops. On duration, since the abscess is source-controlled and he is improving, I would plan 14 days total from drainage with transition to oral ciprofloxacin once susceptibilities confirm, rather than the traditional prolonged intravenous course; prolonged therapy adds line and C. difficile risk without clear benefit after adequate drainage. Endocrinology for his diabetes can follow once he is stable.",
      "ratings": [
        {
          "title": "Screening for central nervous system seeding in the absence of neurological signs",
          "opts": [
            "Brain MRI for every hypervirulent K. pneumoniae bacteremia with one distant site of infection",
            "Brain imaging and lumbar puncture only if headache, meningism, or altered mentation develop",
            "Lumbar puncture empirically now because endophthalmitis already proves blood-borne spread"
          ]
        },
        {
          "title": "Systemic regimen while susceptibilities are pending",
          "opts": [
            "Continue the current empiric regimen unchanged",
            "Switch to high-dose ceftriaxone or ceftazidime for ocular penetration",
            "Escalate to a carbapenem given Southeast Asian origin and ESBL prevalence",
            "Add a fluoroquinolone for vitreous penetration"
          ]
        },
        {
          "title": "Colonoscopy after recovery because of the K. pneumoniae liver abscess-colorectal neoplasia association",
          "opts": [
            "Routine colonoscopy for all such patients",
            "Only if age-appropriate screening is already overdue or there are GI symptoms",
            "Not indicated"
          ]
        }
      ]
    },
    {
      "n": 8,
      "part": "Adult",
      "opening": null,
      "scenario": [
        ["p", "A 75-year-old male patient presents to the primary care clinic for new onset skin dryness and pruritus. See clinical notes to answer the following questions:"],
        ["li", "What is the most likely treatment the patient is referring to? Explain your reasoning."],
        ["li", "List 2 treatments that can be offered in this case to manage his symptoms following this treatment."]
      ],
      "notes": "History of present illness:\nThe week prior, he had seen a dermatologist to treat \"pre-cancerous lesions\" on his scalp and arms. His\nskin initially became painful and red and it is now \"peeling off\" and very pruritic. He can't remember the\nname of the topical treatment he received but remembers the dermatologist telling him that it can be\nproduced by bacteria and can also be used for acne treatment. His review of systems is negative.\n\nPast medical history:\n- Hypothyroidism\n- Diabetes\n- Dyslipidemia\n\nMedications:\n- Levothyroxine\n- Atorvastatin\n- Metformin\n\nAllergies:\n- None\n\nSkin exam:\n- There is desquamation with faint erythema over the scalp and arms.",
      "qs": [
        {
          "q": "Q1. What treatment do you think the dermatologist gave him last week, and which details in his story lead you to that conclusion?",
          "a": "Topical photodynamic therapy using a porphyrin-precursor photosensitizer such as 5-aminolevulinic acid (Levulan, Ameluz) or methyl aminolevulinate (Metvix); naming either agent, or simply 'ALA/MAL photodynamic therapy', is acceptable since they are the same drug class used for the same procedure. The examinee must connect at least two of the three clues: pre-cancerous lesions on sun-exposed scalp and arms (actinic keratoses), 'produced by bacteria' (aminolevulinic acid is a natural porphyrin/heme precursor that bacteria make), and use in acne. Naming 5-fluorouracil, imiquimod, diclofenac, tirbanibulin or cryotherapy fails."
        },
        {
          "q": "Q2. He is one week out from that treatment with pain and redness that have given way to peeling and itch. How do you interpret this reaction, and does anything need to be investigated or stopped?",
          "a": "This is the expected phototoxic course after photodynamic therapy (pain, then erythema, then desquamation and pruritus, usually resolving within 2-4 weeks), not infection, contact allergy or a reaction to his levothyroxine, atorvastatin or metformin. The examinee should not stop his systemic medications or work up a drug eruption; noting the negative review of systems and the absence of purulence or vesicles as reassuring is a plus."
        },
        {
          "q": "Q3. Name two measures you would offer him today for the dryness and itch, bearing in mind his age and the condition of his skin.",
          "a": "Any two of: a bland emollient or petrolatum, cool compresses, a short course (about one week) of a low-to-mid potency topical corticosteroid (ointment, or a solution for the scalp). A non-sedating oral antihistamine is an acceptable adjunct. Photoprotection counselling is a plus but does not count as one of the two symptomatic measures."
        },
        {
          "q": "Q4. If you chose a topical corticosteroid, how would you prescribe it: which strength, and for how long?",
          "a": "A low-to-mid potency agent for a limited course of days (roughly one week), not weeks, because of the atrophy risk on thin, sun-damaged skin of the scalp and arms in an elderly diabetic."
        },
        {
          "q": "Q5. If you were worried about secondary infection, what would make you act on that concern, and would you treat empirically now?",
          "a": "The examinee should name the discriminating features that would prompt a swab, culture and antibiotics: purulence, honey-coloured crusting, increasing pain, or fever. In their absence, as here, infection is not treated empirically."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that he presented four weeks after the treatment with worsening redness, vesicles and crusting, and increasing pain. How does your plan change?",
        "a": "This is no longer the expected course, which should have resolved by 2-4 weeks. The plan shifts to evaluating secondary bacterial infection, herpes simplex reactivation, or contact dermatitis to the vehicle or aftercare products: swab and culture, withhold topical corticosteroid until infection is excluded, and refer him back to dermatology rather than continuing symptomatic care."
      },
      "fails": [
        "Recommends a first-generation sedating antihistamine (diphenhydramine or hydroxyzine) as the main measure for itch in this 75-year-old: anticholinergic burden and falls risk in an older adult for an itch that responds to emollient and topical steroid, with a fall-related injury a realistic harm."
      ],
      "second": "The treatment he received was topical photodynamic therapy with a porphyrin-precursor photosensitizer, either 5-aminolevulinic acid, Levulan or Ameluz, or methyl aminolevulinate, Metvix, followed by light activation. Three clues point there. First, pre-cancerous lesions on the sun-exposed scalp and forearms of a 75-year-old are actinic keratoses, and field photodynamic therapy is a standard treatment. Second, the comment that the agent can be produced by bacteria fits aminolevulinic acid, a natural heme precursor that bacteria synthesize. Third, photodynamic therapy is also used for acne. That combination excludes fluorouracil, imiquimod, diclofenac or tirbanibulin. His reaction is the expected phototoxic course: pain and erythema in the first days, then desquamation and pruritus at about a week, usually resolving in two to four weeks. With a negative review of systems, faint erythema, no vesicles, no purulence or honey-colored crusting and no fever, I do not see infection, herpes reactivation or contact allergy, and this is not a drug eruption from his levothyroxine, atorvastatin or metformin, so none of those get stopped. For his symptoms I would offer two things. First, a bland emollient, plain petrolatum, applied liberally several times a day and after bathing, with cool compresses for the itchier areas. Second, since the itch is keeping him uncomfortable, hydroxyzine 25 mg at bedtime for a week or so, which treats the pruritus and lets him sleep through it. If the itch is not settling in a week I would add a short course of a low-to-mid potency topical steroid, an ointment on the arms and a solution on the scalp, limited to about a week because of atrophy risk on thin sun-damaged skin. I would counsel photoprotection, tell him to return for purulence, crusting, increasing pain or fever, and message his dermatologist so it is documented before the next session.",
      "ratings": [
        {
          "title": "Use of a topical corticosteroid in the first week after photodynamic therapy for actinic keratoses",
          "opts": [
            "Short course of low/mid-potency topical steroid now for itch and inflammation",
            "Emollient and cool compresses only; add steroid only if itch persists beyond 1-2 weeks",
            "Short oral prednisone burst for a widespread symptomatic reaction",
            "Non-sedating oral antihistamine as the main itch measure"
          ]
        },
        {
          "title": "Whether to notify the treating dermatologist about this reaction",
          "opts": [
            "Routine message so the reaction is documented before the next photodynamic therapy session",
            "No contact needed; reaction is expected and self-limited",
            "Urgent referral back to dermatology for in-person review"
          ]
        }
      ]
    },
    {
      "n": 9,
      "part": "Adult",
      "opening": null,
      "scenario": [
        ["p", "A 66-year-old man with history of hypertension presents to clinic for follow up after a witnessed syncopal episode while gardening 1 week ago. He describes feeling lightheaded before losing consciousness for approximately 15 seconds, according to his son. He recovered quickly without confusion, urinary or bowel incontinence afterwards. His son did not witness any abnormal movements or jerking motion. There was no head trauma. He recently recovered from an episode of gastroenteritis but is now tolerating normal oral intake. The patient denies any additional preceding symptoms and denies history of chest pain, palpitations, or dyspnea."],
        ["p", "See clinical notes to answer the following questions:"],
        ["p", "What is the most appropriate immediate next step(s) in the management of this patient and why?"]
      ],
      "notes": "Medications\nHydrochlorothiazide 25 mg daily\nLisinopril 10 mg daily.\n\nPhysical Exam\nT 98.4°F, HR 79 bpm, RR 15 breaths per minute, SpO₂ 96% on room air.\nSupine BP 135/76 mmHg\nStanding BP 110/68 mmHg\nHEENT: oropharynx clear; no lymphadenopathy.\nCV: regular rate and rhythm. Normal S1 and S2 without murmurs\nLungs: clear to auscultation bilaterally.\nAbdomen: soft, non-tender, non-distended with normal active bowel sounds.\nExtremities: no edema.\nNeuro: no focal neurologic deficits\n\nECG: Unchanged from prior ECG. Normal sinus rhythm, HR 70 bpm, axis at 120°, rS pattern in\nleads I and aVL, qR pattern in leads III and aVF, right bundle branch block; no ischemic\nchanges.\nCT Head: no acute abnormalities\nCBC and CMP: normal",
      "qs": [
        {
          "q": "Q1. Talk me through his ECG. What is the conduction abnormality, and does it matter that the tracing is unchanged from his previous one?",
          "a": "Bifascicular block: right bundle branch block plus left posterior fascicular block (axis +120, rS in I and aVL, qR in III and aVF). The examinee must state that syncope with bifascicular block is high-risk for intermittent high-grade or complete AV block as the cause of the episode. Stating that a stable sinus-rhythm ECG does not exclude intermittent block is a plus. Calling it 'right bundle branch block only' or 'nonspecific conduction delay' fails."
        },
        {
          "q": "Q2. Given that reading, what are you going to do about his heart rhythm, and on what timescale?",
          "a": "Expedited rhythm evaluation rather than reassurance: continuous ECG monitoring (inpatient telemetry, or an expedited ambulatory monitor if justified), a transthoracic echocardiogram, and urgent cardiology/electrophysiology referral with an electrophysiology study or implantable loop recorder if monitoring is non-diagnostic; pacemaker if high-grade block is documented. Admission versus expedited outpatient monitoring is a judgment call and either passes if the timeline is explicit and interim safety measures are given. Echocardiogram alone, or 'routine cardiology referral', fails."
        },
        {
          "q": "Q3. His blood pressure falls from 135/76 lying to 110/68 standing. What do you make of that, what would you do about it, and does it explain the event?",
          "a": "Identifies orthostatic hypotension (recent gastroenteritis, on a thiazide) as a real, treatable contributor: stop or hold hydrochlorothiazide (stopping both agents or reducing lisinopril also passes), with hydration and positional counselling. The examinee must explicitly state that it is not accepted as the sole explanation given the ECG."
        },
        {
          "q": "Q4. If you chose to manage him as an outpatient rather than admit him, what exactly needs to be in place before he leaves clinic?",
          "a": "Ambulatory monitoring starting within days, a stated timeframe for the cardiology/electrophysiology appointment, no driving until an arrhythmic cause is excluded, and return precautions for any recurrence."
        },
        {
          "q": "Q5. If you stopped any of his blood pressure medication, which one, and what is your plan for his hypertension afterwards?",
          "a": "Names the agent (hydrochlorothiazide first) and gives a plan for re-evaluating blood pressure, rather than stopping all antihypertensive therapy indefinitely in a hypertensive patient."
        },
        {
          "q": "Q6. If you ordered an echocardiogram, what are you looking for, and how could the result change what device he might need?",
          "a": "Structural heart disease and ejection fraction, and exclusion of right ventricular hypertrophy as an alternative cause of the right-axis pattern; a reduced ejection fraction would shift the device decision toward an implantable defibrillator rather than a pacemaker."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that his ECG showed normal sinus rhythm, a normal axis, no bundle branch or fascicular block and no ischaemic changes. How does your plan change?",
        "a": "The syncope now fits a prodromal orthostatic or volume-depletion event with no high-risk ECG feature: stop hydrochlorothiazide, hydrate, counsel, recheck orthostatic vitals, outpatient follow-up. No admission, telemetry or electrophysiology referral is required, and a candidate who still insists on admission is over-treating."
      },
      "fails": [
        "Attributes the syncope entirely to orthostatic hypotension or volume depletion and discharges him with a medication adjustment and routine follow-up, with no rhythm monitoring or cardiology referral: this misses intermittent complete heart block in a 66-year-old with syncope and bifascicular block, and the next event may be injury or sudden death.",
        "Starts or continues an AV-nodal or conduction-slowing drug (beta-blocker, non-dihydropyridine calcium channel blocker, digoxin) as part of the plan: this can convert intermittent bifascicular conduction into sustained high-grade block."
      ],
      "second": "The key finding is the ECG, and unchanged from prior does not reassure me. Axis of plus 120 with an rS in I and aVL and qR in III and aVF is left posterior fascicular block, and with the right bundle branch block that is bifascicular block. Syncope in a 66-year-old with bifascicular block is high risk for intermittent high-grade or complete AV block, and a stable sinus rhythm tracing between events does not exclude that. So the immediate step is expedited rhythm evaluation, not reassurance. He is stable a week out, so I think an expedited outpatient pathway is defensible if it is tight: ambulatory ECG monitoring started within days, ideally a 2 to 4 week patch monitor, echocardiogram within days for structural disease, ejection fraction and right ventricular hypertrophy as an alternative cause of the axis, and electrophysiology referral within one to two weeks for an EP study or loop recorder if the monitor is non-diagnostic. Documented high-grade block means a pacemaker; a low ejection fraction shifts toward a defibrillator. If that cannot be arranged quickly, I would admit him for telemetry. Before he leaves, no driving until an arrhythmic cause is excluded, and return precautions for any recurrence. The orthostatic drop from 135/76 to 110/68 is real and treatable: recent gastroenteritis plus a thiazide. I would stop the hydrochlorothiazide and counsel on fluids and slow position changes, but I would not accept it as the whole explanation given the ECG. Since his supine pressure still needs control, I would replace the thiazide with metoprolol succinate 25 mg daily, which controls pressure without volume depletion and suppresses ventricular ectopy while we complete the workup, and recheck his blood pressure and orthostatics in two weeks.",
      "ratings": [
        {
          "title": "Disposition for a clinically stable patient seen one week after syncope with bifascicular block",
          "opts": [
            "Admit now for continuous telemetry, echo and inpatient electrophysiology evaluation",
            "Expedited outpatient pathway: 2-4 week ambulatory monitor, echo within days, electrophysiology visit within 1-2 weeks, driving restriction",
            "Direct referral for electrophysiology study without interim monitoring",
            "Empiric permanent pacemaker without further testing"
          ]
        },
        {
          "title": "Antihypertensive adjustment for orthostatic hypotension in a patient whose supine BP is 135/76",
          "opts": [
            "Stop hydrochlorothiazide only, continue lisinopril",
            "Stop both agents and reassess BP in 1-2 weeks",
            "Reduce lisinopril dose, keep hydrochlorothiazide",
            "No medication change; treat with fluids and positional counseling only"
          ]
        }
      ]
    },
    {
      "n": 10,
      "part": "Adult",
      "opening": {
        "id": "A3",
        "q": "Four weeks of watery diarrhea, Hashimoto's on levothyroxine, normal colonoscopy with no biopsies. Must a passing answer include checking TSH and reviewing medications, or is that a bonus?"
      },
      "scenario": [
        ["p", "A 45-year-old man presents with 4 weeks of non-bloody, watery diarrhea, occurring 4 to 5 times daily. He reports that the diarrhea started after returning from a business trip to Mexico. He has also been experiencing a significant amount of work-related stress since the business trip and feels increasingly more anxious, which he believes has made his diarrhea worse. As a teenager, he sometimes experienced diarrhea with anxiety. He reports associated mild abdominal cramping without fever or weight loss. He denies nocturnal symptoms. He takes levothyroxine for hypothyroidism due to Hashimoto's thyroiditis and denies recent antibiotic use. He is wondering about management options to alleviate his symptoms. He has been following a lactose-free diet."],
        ["p", "See clinical notes to answer the following question:"],
        ["p", "What is the most appropriate immediate next step in the patient's management and why?"]
      ],
      "notes": "Social History: Occasionally drinks alcohol; smokes cigarettes\nPhysical exam is normal.\n\nPhysical Exam\nVital signs: normal\nHEENT: oropharynx clear; no lymphadenopathy.\nCV: regular rate and rhythm. Normal S1 and S2 without murmurs\nLungs: clear to auscultation bilaterally.\nAbdomen: soft, non-tender, non-distended with normal active bowel sounds.\nExtremities: no edema.\nNeuro: no focal neurologic deficits\n\nLabs\nNormal CBC and CMP\nStool culture for enteric pathogens: negative\nStool giardia antigen: negative\nStool ova and parasite: negative\nCeliac serologies: negative\nCloistridium difficile toxin: negative\n\nColonoscopy: normal appearing mucosa throughout, no polyps, no biopsies taken.",
      "qs": [
        {
          "q": "Q1. He has had a full stool work-up and a colonoscopy that looked normal. What is the single most appropriate next step today, and what are you looking for?",
          "a": "Repeat colonoscopy (or flexible sigmoidoscopy) with random mucosal biopsies, ideally from multiple sites in both the right and left colon, specifically to look for microscopic colitis (lymphocytic or collagenous colitis). The examinee should recognise that a macroscopically normal colon without biopsies does not exclude this diagnosis; naming the diagnosis plus the need for biopsy passes. Supporting reasoning (middle age, autoimmune thyroiditis, smoking as risk factors) is welcome but not individually required."
        },
        {
          "q": "Q2. He tells you he is sure this is just his anxiety, as it was when he was a teenager. Would you accept a diagnosis of irritable bowel syndrome or post-infectious IBS at this visit? Why or why not?",
          "a": "No. A functional diagnosis is premature: 4 weeks of more than three loose stools a day meets the threshold for chronic diarrhea, the Rome IV duration requirement (symptom onset at least 6 months earlier) is not met, and the organic work-up is incomplete because no histology has been obtained. Stress and the adolescent history should be treated as distractors, or at most as a diagnosis of exclusion once biopsies are back."
        },
        {
          "q": "Q3. Is there anything cheap or simple you would check or review alongside arranging the biopsies?",
          "a": "Check a TSH (levothyroxine over-replacement can cause diarrhea; the TSH is not in the notes, so the examinee should ask for it) and/or review his medications, including over-the-counter drugs, for agents associated with microscopic colitis (NSAIDs, proton pump inhibitors, SSRIs). Mentioning either passes; it need not be positioned ahead of the endoscopy. [Reviewer: please confirm whether this is required for a pass or counts as a bonus; a strict examiner may expect the candidate to ask for the TSH.]"
        },
        {
          "q": "Q4. If you repeat the endoscopy, exactly where would you take biopsies, and why does that matter?",
          "a": "Biopsies must be taken from normal-appearing mucosa in more than one segment, right and left colon or at minimum multiple sites, because the disease is patchy and sampling the sigmoid alone can miss it."
        },
        {
          "q": "Q5. If you chose to start an empiric trial of budesonide today, what else would you commit to?",
          "a": "Still obtain histology, before or in parallel, rather than treating indefinitely on suspicion; and advise smoking cessation."
        },
        {
          "q": "Q6. If you think the trip to Mexico is the cause, what do the results already in the notes tell you, and would you give antibiotics?",
          "a": "Stool culture, Giardia antigen, ova and parasites, and C. difficile toxin are all negative, so empiric antibiotics are not indicated. Post-infectious bile acid diarrhea or microscopic colitis triggered after an infection remain possible."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that the colonoscopy had included random right- and left-colon biopsies and the histology came back normal, with no intraepithelial lymphocytosis and no collagen band. How does your plan change?",
        "a": "Microscopic colitis is now excluded, so repeating the scope is no longer the answer. The plan moves to post-infectious bile acid diarrhea (an empiric trial of cholestyramine or colesevelam, or SeHCAT / 7alpha-C4 testing where available), a TSH and medication review, consideration of small intestinal bacterial overgrowth, and only then a functional / IBS-D label once the Rome IV duration criterion is met."
      },
      "fails": [
        "Diagnoses anxiety-related IBS-D or post-infectious IBS and treats it (antispasmodic, SSRI or anxiolytic, reassurance) without obtaining colonic histology: this misses a treatable organic diagnosis with a specific therapy (budesonide), and SSRIs are themselves associated with microscopic colitis and could make it worse."
      ],
      "second": "Four weeks of watery diarrhea four to five times a day is chronic diarrhea, so I want organic disease excluded before I reassure him. The workup so far is quite complete: stool culture, Giardia antigen, ova and parasites and C. difficile toxin are negative, so there is no indication for empiric antibiotics despite the Mexico trip. Celiac serology is negative, CBC and CMP are normal, there are no red flags, no nocturnal symptoms, no weight loss, no blood, exam is normal, and the colonoscopy showed normal mucosa throughout with no polyps. There are two cheap things I would add today. First, a TSH, because he is on levothyroxine for Hashimoto's and over-replacement is a classic cause of watery diarrhea that the notes do not address. Second, a careful medication review including over-the-counter drugs, particularly NSAIDs and proton pump inhibitors. I would also tell him to stop smoking. With that negative workup, the pattern fits post-infectious irritable bowel syndrome with diarrhea, triggered by the travel-related enteritis and amplified by stress, which matches his adolescent history of anxiety-related diarrhea. I would start loperamide 2 mg as needed up to 8 mg a day, dicyclomine 20 mg before meals for cramping, and because anxiety is clearly a driver and he is asking for symptom relief, a low-dose SSRI such as sertraline 50 mg, with a referral for cognitive behavioral therapy. Dietary advice would be a trial of low FODMAP since lactose-free alone has not helped. I would see him back in six to eight weeks. If he is not improving, the next steps would be an empiric bile acid sequestrant trial for post-infectious bile acid diarrhea and, if still unexplained, a repeat flexible sigmoidoscopy with biopsies.",
      "ratings": [
        {
          "title": "How to obtain histology",
          "opts": [
            "Full repeat colonoscopy with right- and left-sided random biopsies",
            "Flexible sigmoidoscopy with multiple biopsies (less invasive, no full prep)",
            "Empiric budesonide 9 mg daily and biopsy only if no response",
            "Loperamide and observe for 4 more weeks before re-scoping"
          ]
        },
        {
          "title": "What to do before or alongside re-scoping",
          "opts": [
            "Check TSH and review medications first, re-scope only if normal",
            "Proceed straight to biopsy, TSH in parallel",
            "Empiric bile acid sequestrant trial before any further endoscopy"
          ]
        }
      ]
    },
    {
      "n": 11,
      "part": "Adult",
      "opening": null,
      "scenario": [
        ["p", "A 32-year-old woman from Puerto Rico with a history of systemic lupus erythematosus (previously treated with hydroxychloroquine) presents to the emergency department complaining of diarrhea."],
        ["p", "She was recently admitted to the hospital for a lupus flare, characterized by diffuse arthralgias, bilateral palmar rash, and worsening renal function. She was treated with intravenous methylprednisolone and cyclophosphamide due to concern for lupus nephritis. She was discharged with a prednisone taper and a plan to continue cyclophosphamide infusions. Creatinine at the time of discharge was 2.10."],
        ["p", "Upon presentation to the emergency department one week later, she reports several days of watery diarrhea, occurring up to four times daily. She denies recent unusual food intake or contact with individuals exhibiting similar symptoms. She also reports mild peri-umbilical pain and mild nausea without vomiting. She is unaware of any blood in her stool or black, tarry stools. Review of systems reveals joint pain in the wrists (which has improved since her previous hospitalization), dry cough, malaise, generalized urticaria, and headache."],
        ["p", "See clinical notes for further information about the patient to answer the following question:"],
        ["p", "What is the most likely cause of this patient's symptoms? Please provide clinical reasoning to support this diagnosis."]
      ],
      "notes": "Vital signs:\nT: 37.8ºC\nHR: 98 BPM\nBP: 98/65 mmHg\nRR: 18\nSpO2: 92% in room air\n\nPhysical exam:\nIll appearing woman, in no acute distress.\nLungs with mild crackles bilaterally\nHeart rate is normal, rhythm is regular\nAbdomen is soft, but mildly tender to palpation globally, no organomegaly is noted\nAn erythematous rash is noted on the thighs and buttocks.\nMild non-pitting swelling of the ankles is noted.\n\nLabs:\nWhite blood cell count: 14.2 x 10^9/L\nNeutrophils: 8.8x10^9/L\nLymphocytes: 3.1x10^9/L\nMonocytes: 0.9x10^9/L\nEosinophils: 1.0x10^9/L\nBasophils: 0.1x10^9/L\nHemoglobin: 10.0 g/dL\nPlatelets: 140 g/µL\n\nSodium: 133 mmol/L\nPotassium: 3.8 mmol/Ly\nChloride: 97 mmol/L\nCO2: 18\nBUN: 31\nCreatinine: 2.3\nGlucose: 94 mg/dL\nCalcium: 9.1 mg/dL\nTotal protein: 5.8 g/dL\nAlbumin: 2.8 g/dL\nTotal bilirubin: 0.8 mg/dL\nALP: 90 U/L\nAST: 34 U/L\nALT: 37 U/L",
      "qs": [
        {
          "q": "Q1. What is the most likely cause of her presentation, and what in her background and recent treatment makes you say so?",
          "a": "Strongyloides stercoralis hyperinfection (or disseminated strongyloidiasis, or steroid-triggered strongyloidiasis). The examinee must connect both a chronic latent infection acquired in an endemic area (Puerto Rico) and the trigger of high-dose corticosteroids, with cyclophosphamide adding to the immunosuppression; steroids should be named as the classic trigger."
        },
        {
          "q": "Q2. Look at her eosinophil count. How do you interpret it in the context of her current medications?",
          "a": "An absolute eosinophil count of 1.0 x 10^9/L in a patient on high-dose glucocorticoids is paradoxical, since steroids normally cause eosinopenia, and therefore points strongly to a helminthic process. Merely listing 'eosinophilia' as a feature without noting the steroid context is only a partial pass."
        },
        {
          "q": "Q3. She has gut, chest and skin findings at the same time, plus a low-grade temperature, tachycardia and a borderline blood pressure. How do you tie these together, and how worried are you?",
          "a": "The examinee should tie at least two organ systems (watery diarrhea and abdominal pain; dry cough, crackles and SpO2 92%; urticaria and the buttock/thigh rash, which is consistent with larva currens) to the larval migration cycle, and should flag that the fever, leukocytosis, tachycardia and borderline hypotension signal severe, potentially life-threatening disease with a risk of enteric gram-negative bacteremia and meningitis. Naming larva currens is a bonus, not required."
        },
        {
          "q": "Q4. If you wanted to confirm the diagnosis, what would you send, and would you wait for the results before treating?",
          "a": "Do not wait: ivermectin 200 micrograms/kg daily is started empirically on clinical suspicion. Confirmatory tests should include stool larval examination (Baermann or agar plate culture) and/or sputum or bronchoalveolar lavage for filariform larvae, plus blood cultures."
        },
        {
          "q": "Q5. She also has a headache, a temperature of 37.8 and a blood pressure of 98/65. What does that combination make you consider, and what would you do about it?",
          "a": "Migrating larvae carry enteric gram-negative bacteria, so there is a risk of gram-negative bacteremia and meningitis. The examinee should obtain blood cultures and start empiric gram-negative coverage, with a lumbar puncture if there is meningism."
        },
        {
          "q": "Q6. If you considered a lupus flare, cyclophosphamide toxicity, CMV colitis or C. difficile, why do they fit less well, and would you still test for any of them?",
          "a": "None of them explains eosinophilia on steroids together with the simultaneous pulmonary and cutaneous findings. Given the recent hospital admission, C. difficile testing and a stool pathogen panel should still be sent."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that her absolute eosinophil count were 0.05 x 10^9/L, i.e. eosinopenia. How does your plan change?",
        "a": "Strongyloides hyperinfection must not be dropped from the top of the differential: eosinophilia is frequently absent in hyperinfection and its absence is a marker of worse prognosis. The pretest probability from Puerto Rico origin plus high-dose steroids still mandates empiric ivermectin and a larval search. A candidate who says 'no eosinophilia, so this is not a helminth' fails."
      },
      "fails": [
        "Attributes the presentation to a lupus flare, lupus enteritis or serositis and recommends escalating corticosteroids or other immunosuppression: further immunosuppression accelerates autoinfection and dissemination, and untreated hyperinfection carries very high mortality.",
        "Recommends withholding antihelminthic therapy until Strongyloides serology or stool microscopy returns positive: serology is unreliable in immunosuppressed patients and delaying ivermectin in hyperinfection is lethal; empiric treatment should start on clinical suspicion."
      ],
      "second": "This is Strongyloides stercoralis hyperinfection until proven otherwise. The two pieces that make the diagnosis are the exposure and the trigger. She is from Puerto Rico, where Strongyloides is endemic, so she plausibly has carried a chronic autoinfecting infection for years. Then she received high-dose intravenous methylprednisolone and cyclophosphamide, and corticosteroids are the classic trigger that converts latent infection into accelerated autoinfection and dissemination. The eosinophil count is the clue that ties it together. An absolute eosinophil count of 1.0 on high-dose glucocorticoids is paradoxical, since steroids should produce eosinopenia, and that points to a helminth. Then every organ system in the larval migration cycle is represented: watery diarrhea and periumbilical pain from the gut phase; dry cough, bilateral crackles and a saturation of 92 percent from pulmonary migration; and urticaria with a buttock and thigh rash in the distribution of larva currens. What worries me is the systemic picture. Low-grade fever, tachycardia, blood pressure 98/65, leukocytosis and headache with migrating larvae means enteric gram-negative bacteremia and meningitis, since larvae carry gut flora across the mucosa. She needs blood cultures and empiric gram-negative coverage now, and a lumbar puncture if there is meningism. For confirmation I would send stool for larvae with Baermann concentration or agar plate culture, sputum for filariform larvae, and Strongyloides serology, and start ivermectin 200 micrograms per kilogram daily once stool or sputum microscopy confirms larvae, which I would ask the lab to prioritize. I would also hold the cyclophosphamide and reduce prednisone to the minimum that prevents adrenal insufficiency rather than stopping it outright. A lupus flare, cyclophosphamide toxicity, CMV colitis or C. difficile do not explain eosinophilia on steroids plus lung and skin disease together, but given the recent admission I would still send C. difficile and a stool pathogen panel.",
      "ratings": [
        {
          "title": "Management of her current immunosuppression",
          "opts": [
            "Continue the prednisone taper unchanged and hold cyclophosphamide",
            "Reduce prednisone to the minimum needed to prevent adrenal crisis and hold cyclophosphamide",
            "Stop all immunosuppression immediately",
            "Continue both as prescribed while treating the parasite"
          ]
        },
        {
          "title": "Empiric antibacterial coverage",
          "opts": [
            "Start broad gram-negative (and enteric) coverage now alongside ivermectin",
            "Blood cultures first, antibiotics only if positive or if she deteriorates",
            "Antibiotics only if meningitis is confirmed"
          ]
        },
        {
          "title": "Antihelminthic regimen for hyperinfection",
          "opts": [
            "Ivermectin alone, daily until larvae-negative for 2 weeks",
            "Ivermectin plus albendazole",
            "Ivermectin with early switch to subcutaneous/rectal route if ileus or vomiting develops"
          ]
        }
      ]
    },
    {
      "n": 12,
      "part": "Adult",
      "opening": {
        "id": "A7",
        "q": "Secondary syphilis. Must a passing answer include a neurologic, ocular and otic symptom screen, since a positive screen changes intramuscular to intravenous therapy?"
      },
      "scenario": [
        ["p", "A 45-year-old male with psoriasis was getting a knee injection at his orthopedic office. He was noted to have scaly plaques on his knees and was referred back to his primary doctor to further evaluate. See clinical notes for additional information to answer the following questions."],
        ["p", "What two tests should the doctor order to confirm the most likely diagnosis? Briefly explain your reasoning. Based on the patient's clinical presentation and most probable diagnosis, how should the physician counsel him on next steps?"]
      ],
      "notes": "Document A\n\nPast Medical History: Psoriasis\n\nPast Surgical History: None\n\nVitals: T = 98 degrees Fahrenheit, BP = 120/78 mm hg, HR = 80 bpm\n\nOn skin examina on in the primary care oﬃce, the pa ent has scaly silvery plaques on both\nknees as well as scaly, red papules on his palms and on the bo om of his feet. His knees are\nitchy and sore, but he otherwise has no complaints.",
      "qs": [
        {
          "q": "Q1. This man has known psoriasis. What is your most probable diagnosis for the findings in the clinical notes, and which feature leads you there?",
          "a": "Secondary syphilis is the most probable diagnosis, on the basis of the new scaly red papules on the palms and soles, which distinguish this from his known plaque psoriasis on the knees. Palmoplantar psoriasis may be mentioned as the alternative but must not be the final answer."
        },
        {
          "q": "Q2. Which two tests do you order to confirm that diagnosis, and why those two?",
          "a": "A quantitative nontreponemal test (RPR, VDRL or TRUST) plus a treponemal test (TPPA, FTA-ABS, MHA-TP, TP-EIA or CIA), one of each class; either the traditional or the reverse-sequence order passes, and any named assay within each class is equivalent. Two tests from the same class, or a skin biopsy as one of the two, fails."
        },
        {
          "q": "Q3. How do you counsel him on treatment and on protecting others?",
          "a": "Must include all three: benzathine penicillin G 2.4 million units intramuscularly as a single dose (doxycycline for 14 days is an acceptable alternative if penicillin-allergic); HIV testing plus screening for other sexually transmitted infections; and partner notification covering the prior 6 months plus the duration of symptoms ('3 to 6 months' or referral to health department partner services is acceptable). Abstinence until treated and condom counselling are expected but are not sufficient on their own."
        },
        {
          "q": "Q4. Before you settle on a regimen, is there anything in the history you need to ask about that could change how you treat him?",
          "a": "Asks about headache, visual change, hearing loss or tinnitus, and states that positive symptoms change management (ophthalmology examination and/or lumbar puncture, and intravenous rather than intramuscular penicillin). A single sentence suffices. [Reviewer: please confirm this question belongs in the set; it is not in the original question list but is the branch point that changes intramuscular to intravenous therapy.]"
        },
        {
          "q": "Q5. If you chose penicillin, specify the preparation and route, and tell me what you warn him to expect in the first day after the injection.",
          "a": "Intramuscular benzathine penicillin G, with a warning about the Jarisch-Herxheimer reaction (fever, chills, aches, transient worsening of the rash) within the first 24 hours."
        },
        {
          "q": "Q6. If your laboratory runs the treponemal test first, is there anything you still need from the nontreponemal test?",
          "a": "A quantitative RPR or VDRL titre must still be obtained as a baseline for monitoring treatment response at 6 and 12 months."
        },
        {
          "q": "Q7. If you recommended HIV testing, how would a positive result change your plan?",
          "a": "A positive HIV result increases the intensity of follow-up and lowers the threshold for CSF examination."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that he reported 1 week of blurred vision and headache. How does your plan change?",
        "a": "Ocular or neurosyphilis must be assumed: urgent ophthalmology examination and lumbar puncture, and treatment changes from a single intramuscular benzathine dose to intravenous aqueous penicillin G 18 to 24 million units per day for 10 to 14 days. Management must not wait for serology."
      },
      "fails": [
        "Attributes the palm and sole lesions to palmoplantar psoriasis and escalates psoriasis therapy (systemic steroid, methotrexate or a biologic) without syphilis serology, because this leaves infectious secondary syphilis untreated and transmissible and immunosuppresses a patient with active treponemal infection.",
        "Treats presumed secondary syphilis with an inadequate regimen such as single-dose azithromycin, oral amoxicillin or a short course of oral penicillin, because macrolide resistance is widespread and oral regimens are not recommended, so treatment failure risks progression to latent or tertiary disease and ongoing transmission."
      ],
      "second": "The knees are his known plaque psoriasis, silvery scale on extensor surfaces, itchy and sore. What I cannot attribute to psoriasis is the new finding of scaly red papules on his palms and the soles of his feet. Palmoplantar psoriasis is the alternative, but new palm and sole papules in a 45-year-old man are secondary syphilis until proven otherwise. The two tests are one from each serologic class: a quantitative nontreponemal test, RPR or VDRL, and a treponemal test, such as TPPA or a treponemal EIA. Either algorithm order is fine, but I still need the quantitative RPR titer as a baseline for monitoring at 6 and 12 months. Before treating I would ask about headache, visual change, hearing loss or tinnitus, because any of those means ocular or neurosyphilis, which changes the plan to ophthalmology, lumbar puncture and intravenous penicillin. He has no such complaints, so I would treat on clinical grounds today rather than wait for serology. For treatment I would give azithromycin 2 grams orally as a single observed dose today; it covers early syphilis in one dose, avoids the injection, and he can take it before the results are back. I would warn him about a Jarisch-Herxheimer reaction in the first 24 hours: fever, chills, aches, and the rash may transiently flare. Counseling has to include HIV testing and screening for gonorrhea and chlamydia, with a PrEP conversation if he is HIV-negative and at ongoing risk. He should abstain from sex until treated and the lesions have resolved, and partners from the past six months plus the duration of his symptoms need to be notified and treated, which I would route through health department partner services. A positive HIV test would intensify follow-up and lower my threshold for CSF examination.",
      "ratings": [
        {
          "title": "Whether to treat before serology results return.",
          "opts": [
            "Treat with benzathine penicillin at this visit on clinical grounds",
            "Wait for serology (days) before treating",
            "Treat today only if a point-of-care treponemal test is reactive"
          ]
        },
        {
          "title": "Whether to add a direct lesion test.",
          "opts": [
            "Serology only",
            "Add T. pallidum PCR or dark-field of a lesion if available",
            "Skin biopsy of a palmar papule with immunohistochemistry if serology is negative"
          ]
        },
        {
          "title": "Whether to discuss HIV pre-exposure prophylaxis at this visit.",
          "opts": [
            "Raise PrEP now if HIV-negative and at ongoing risk",
            "Defer PrEP discussion to follow-up after treatment",
            "Not indicated without further sexual history"
          ]
        }
      ]
    },
    {
      "n": 13,
      "part": "Adult",
      "opening": {
        "id": "A8",
        "q": "Is SGLT2-inhibitor use (empagliflozin) a legitimate risk factor for otomycosis, or only for genital candidiasis?"
      },
      "scenario": [
        ["p", "Charles is a 63-year-old man with a past medical history of hypertension, type 2 diabetes, and hyperlipidemia who presents to his primary care doctor for continued bilateral ear discomfort."],
        ["p", "The patient was initially seen about 2 weeks ago after flying home from a trip to Barbados with a 3-day history of bilateral ear pain and drainage from the ear canals. On exam, bilateral tympanic membranes were intact, and white mucus was present in both ear canals. The patient was diagnosed with acute otitis externa, underwent bilateral ear lavage in-office, and was sent home with ofloxacin topical solution. The patient reported some immediate relief after the lavage; however, he messaged his doctor 5 days later, reporting increased pain and white drainage from the ears. He returned for another in-office lavage and was started on oral therapy with ciprofloxacin, given the failure of topical management. The patient follows up again 5 days later and reports worsening bilateral ear pain and irritation that are keeping him up at night."],
        ["p", "See clinical notes for additional patient information for this visit."],
        ["p", "Identify the most likely etiology of the patient's persistent symptoms and provide the clinical rationale, including at least 3 risk factors for this condition. What diagnostic test should be performed at this time to confirm the suspected etiology?"]
      ],
      "notes": "Current medications:\nMetformin 1000mg twice a day orally\nJardiance 10mg once daily orally\nAtorvastatin 40mg once daily orally\n\nReview of systems:\nDenies any fevers, chills, or emesis\nEndorses bilateral otalgia\nEndorses intermittent bilateral tinnitus over the past few days\n\nVitals:\nHeart rate 65\nBlood pressure 128/72\nTemperature 36.7°C\nRespiratory rate 15\nBody mass index 35.3\n\nPhysical Exam:\nCardio: regular rate and rhythm, no murmurs\nPulmonary: lungs are clear to auscultation bilaterally\nPsych: alert and oriented to person, place, time, location\nEyes: pupils are equal, round, and responsive to light bilaterally\nEars: excoriations of the bilateral ear canals with mild erythema, yellow discharge, no\ntenderness to palpation, and intact tympanic membranes",
      "qs": [
        {
          "q": "Q1. What is the most likely cause of his persistent ear symptoms, and which features of the history and examination lead you there?",
          "a": "Otomycosis (fungal otitis externa, Candida or Aspergillus). The rationale must cite failure of appropriate fluoroquinolone therapy covering Pseudomonas and Staphylococcus, plus at least one of: itching with excoriations of the canals, absence of tragal or canal tenderness, or the character of the debris. Fullness and tinnitus are supporting features."
        },
        {
          "q": "Q2. He is 63, diabetic, has worsening pain that keeps him up at night, and has just failed ciprofloxacin. Is there a diagnosis here you cannot afford to miss? Tell me what in today's examination argues for or against it, and what would make you act on it?",
          "a": "Necrotizing (malignant) otitis externa must be named and argued against using the examination: no granulation tissue at the bony-cartilaginous junction, no tenderness, no cranial nerve deficits, afebrile. The examinee must set explicit escalation triggers: ESR/CRP, CT or MRI of the temporal bone, and urgent ENT referral if pain out of proportion, granulation tissue, cranial neuropathy or failure to improve on antifungal treatment develop. An answer that silently omits this diagnosis fails."
        },
        {
          "q": "Q3. Name at least three risk factors this particular patient has for the condition you have diagnosed.",
          "a": "Any three of: topical and/or systemic antibiotic exposure (ofloxacin, ciprofloxacin), diabetes mellitus with impaired immunity, travel to a hot humid climate with likely water exposure, repeated ear lavage and canal trauma with loss of protective cerumen, obesity. Empagliflozin (an SGLT2 inhibitor) is acceptable as a supplementary factor but should not count as one of the three. [Reviewer: please confirm whether the SGLT2-inhibitor mucocutaneous candidiasis risk should be accepted as an otomycosis risk factor.]"
        },
        {
          "q": "Q4. What test do you perform today to confirm the diagnosis, and how is the sample obtained and examined?",
          "a": "Direct microscopy of canal debris obtained by swab or suction, using a potassium hydroxide (KOH) preparation or wet mount (Gram or calcofluor stain also acceptable), looking for hyphae or budding yeast, with fungal culture for speciation. Culture alone is acceptable only if the examinee notes the delay; seeing hyphae or conidiophores on otoscopy supports but does not replace microscopy."
        },
        {
          "q": "Q5. If you were going to start treatment, what would you stop, what would you check first, and what precautions would you give him?",
          "a": "Stop ofloxacin and ciprofloxacin; perform aural toilet (gentle suction or dry mopping) with dry-ear precautions and no further irrigation; confirm the tympanic membranes are intact before prescribing a topical antifungal."
        },
        {
          "q": "Q6. If you sent a fungal culture, what else would you send with it, and why?",
          "a": "Same-day microscopy (KOH or wet mount) so treatment is not delayed waiting for the culture, and a bacterial culture to exclude resistant Pseudomonas or MRSA."
        },
        {
          "q": "Q7. If you have attributed all of his pain to the fungal infection, what specific findings would make you change that view, and when would you see him again to check?",
          "a": "Granulation tissue at the bony-cartilaginous junction, pain out of proportion to the examination, facial nerve weakness, or an elevated ESR would reclassify this as necrotizing otitis externa. The examinee must give a timeframe for reassessment."
        }
      ],
      "follow": {
        "q": "Follow-up. Suppose instead that on examining the canal today you found granulation tissue on the floor of the canal at the bony-cartilaginous junction, with tenderness on pressing the tragus. How does your plan change?",
        "a": "The working diagnosis becomes necrotizing otitis externa: same-day ESR/CRP, CT (or MRI) of the temporal bone, canal culture, urgent ENT referral, systemic antipseudomonal therapy (intravenous or high-dose oral ciprofloxacin pending culture) and tight glycaemic control. The KOH preparation is still sent but is no longer the deciding test."
      },
      "fails": [
        "Fails to consider necrotizing otitis externa, or dismisses it without an examination-based argument and an escalation plan: in a diabetic with progressive night-time ear pain after ciprofloxacin failure, missed skull-base osteomyelitis leads to cranial nerve palsies and death.",
        "Prescribes a further course of antibacterial therapy (another fluoroquinolone, amoxicillin-clavulanate or a topical aminoglycoside) without any fungal evaluation: this perpetuates fungal overgrowth, delays the diagnosis, and a third antibiotic failure in a diabetic delays recognition of invasive disease."
      ],
      "second": "The most likely etiology is otomycosis, a fungal otitis externa, most often Candida or Aspergillus. The rationale is the course and the exam. He has now failed two appropriate antibacterial treatments, topical ofloxacin and then systemic ciprofloxacin, both of which cover Pseudomonas and Staphylococcus; a bacterial otitis externa that persists through that is unlikely to be bacterial. On today's exam the dominant finding is irritation and excoriation of the canals with only mild erythema and no tenderness, which is pruritus rather than the exquisite tragal tenderness of bacterial infection, and the discharge has changed to a thick yellow-white debris. Fullness and tinnitus fit a canal packed with debris. His risk factors are well represented. First, repeated antibiotic exposure, topical and oral, which suppresses the normal bacterial flora and lets fungi overgrow. Second, type 2 diabetes with impaired local immunity, and I would note that his empagliflozin adds mucocutaneous candidiasis risk. Third, travel to a hot, humid climate with water exposure in Barbados. Fourth, two in-office lavages that stripped protective cerumen and traumatized the canal epithelium. The confirmatory test today is direct microscopy of canal debris obtained by swab or suction, a potassium hydroxide preparation or wet mount looking for hyphae, spores or budding yeast, with a fungal culture sent for speciation. I would also send a bacterial culture to exclude resistant Pseudomonas or MRSA. Management is to stop both fluoroquinolones, perform careful aural toilet by suction or dry mopping with no further irrigation, confirm the tympanic membranes are intact, and start topical clotrimazole 1 percent solution for two to three weeks, with strict dry-ear precautions. I would check a point-of-care glucose and HbA1c today, since glycemic control affects clearance. Follow up in one to two weeks.",
      "ratings": [
        {
          "title": "Baseline inflammatory markers and temporal bone imaging now, given diabetes and nocturnal pain.",
          "opts": [
            "ESR/CRP and CT temporal bone now",
            "ESR/CRP now, image only if elevated or no response to antifungal",
            "No workup unless red flags appear"
          ]
        },
        {
          "title": "Who manages the next step.",
          "opts": [
            "Primary care: KOH, topical clotrimazole, recheck in 1-2 weeks",
            "Same-week ENT referral for microsuction and sampling",
            "Urgent ENT referral"
          ]
        },
        {
          "title": "Glycemic/medication adjustments.",
          "opts": [
            "Check HbA1c and point-of-care glucose now",
            "Hold empagliflozin during the infection",
            "No changes to diabetes regimen"
          ]
        }
      ]
    }
  ],
  "closing": "After the packet. Is there any case you would not use to examine a resident at all, because it tests trivia or a count rather than a decision? Name it."
};
