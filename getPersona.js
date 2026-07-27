import { BF_PERSONA } from "./persona/boyfriend.js";
import { BESTFRIEND } from "./persona/bestfriend.js";
import { TEACHER } from "./persona/teacher.js";
import { STUDY_MATE } from "./persona/studymate.js";
import { THERAPIST } from "./persona/therapist.js";
import { MOTIVATOR } from "./persona/motivator.js";

const PERSONA_MAP = {
    boyfriend: BF_PERSONA,
    bestfriend: BESTFRIEND,
    teacher: TEACHER,
    study: STUDY_MATE,
    therapist: THERAPIST,
    motivator: MOTIVATOR,
};

export function getPersona(currentPersona) {
    return PERSONA_MAP[currentPersona] || BF_PERSONA;
}