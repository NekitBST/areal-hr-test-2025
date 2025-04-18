<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}{{ required ? '*' : '' }}</label>
    <div class="p-inputgroup">
      <Dropdown
        :id="id"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :options="options"
        :optionLabel="shouldUseOptionLabel ? optionLabel : undefined"
        :optionValue="shouldUseOptionValue ? optionValue : undefined"
        :placeholder="placeholder"
        :class="{ 'p-invalid': error }"
        v-bind="$attrs"
      />
      <Button
        v-if="clearable"
        icon="pi pi-times"
        @click="$emit('update:modelValue', null)"
        :disabled="!modelValue"
      />
    </div>
    <small v-if="error" class="p-error">{{ error }}</small>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  optionLabel: {
    type: String,
    default: 'name'
  },
  optionValue: {
    type: String,
    default: 'id'
  },
  placeholder: {
    type: String,
    default: 'Выберите значение'
  },
  clearable: {
    type: Boolean,
    default: true
  }
})

const shouldUseOptionLabel = computed(() => {
  return props.options.length > 0 && typeof props.options[0] === 'object'
})

const shouldUseOptionValue = computed(() => {
  return props.options.length > 0 && typeof props.options[0] === 'object'
})

defineEmits(['update:modelValue'])
</script> 