<div class="ppc-element__form">
    <p class="ppc-element-form__notice ppc-element-form__notice--error" v-if="option_load_error">
        Error loading form
        options.
    </p>
    <p class="ppc-element-form__notice" v-else-if="!options_loaded">Loading form options...</p>
    <div v-else class="ppc-element-form">
        <div class="form-group">
            <label class="field-label" for="type">Type</label>
            <select v-model="formData.type" class="form-field" name="type" id="type">
                <option :value="null" disabled="disabled">Select Type</option>
                <option v-for="option in type_options" :value="option">{{option.name}}</option>
            </select>
        </div>
        <div class="form-group" v-if="show_element">
            <label class="field-label" for="element">Element</label>
            <select v-model="formData.element" class="form-field" name="element" id="element">
                <option :value="null" disabled="disabled">Select Element</option>
                <option v-for="option in type_element_options" :value="option">{{option.name}}</option>
            </select>
        </div>
        <div class="form-group" v-for="(move, index) in formData.moves">
            <label class="field-label" :for="moveKey(index)">{{moveName(index)}}</label>
            <select v-model="formData.moves[index]" class="form-field" :name="moveKey(index)" :id="moveKey(index)">
                <option :value="null" disabled="disabled">Select Move</option>
                <option v-for="option in move_options" :value="option">{{option.name}}</option>
            </select>
        </div>
        <div class="form-group"
             v-if="show_transition">
            <label class="field-label sr-only"
                   for="transition">Transition Description
            </label>
            <input type="text"
                   v-model="formData.transition_description"
                   class="form-field"
                   placeholder="Enter Description"
                   id="transition"
                   name="transition">
        </div>
        <div class="ppc-element-form__cta">
            <div class="ppc-element-form__cta-element">
                <button class="button button--info button--block" v-on:click="cancel_button_action">{{cancel_button_text}}</button>
            </div>
            <div class="ppc-element-form__cta-element">
                <button class="button  button--block" :disabled="save_disabled" v-on:click="saveElement()">
                    {{save_button_text}}
                </button>
            </div>
        </div>
    </div>
</div>