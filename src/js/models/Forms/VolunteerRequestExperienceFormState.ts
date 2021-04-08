import {FormState} from '../FormState';
import {VolunteerExperienceItemData} from '../../contracts/release3/data/VolunteerOpportunitiesDataContracts';

export interface ExperienceData {
    [key: string]: ExperienceDatum;
}

export interface ExperienceDatum {
    selected: true;
    description: string;
}

export interface VolunteerRequestExperienceFormData {
    experience: VolunteerExperienceItemData[];
    skillset: string | null;
}

export class VolunteerRequestExperienceFormState extends FormState {
    experience: ExperienceData = {};
    skillset: string = '';

    /**
     * Export the form state
     */
    export(): VolunteerRequestExperienceFormData {

        return {
            experience: this.exportExperience(),
            skillset: this.skillset || null
        };
    }

    /**
     * Export experience data point
     */
    private exportExperience() {
        const exported_experience: VolunteerExperienceItemData[] = [];
        for (const key in this.experience) {
            if (Object.prototype.hasOwnProperty.call(this.experience, key)) {
                const experienceElement = this.experience[key];
                if (experienceElement.selected === true) {
                    exported_experience.push({
                        value: key,
                        description: experienceElement.description
                    });
                }
            }
        }

        return exported_experience;
    }
}