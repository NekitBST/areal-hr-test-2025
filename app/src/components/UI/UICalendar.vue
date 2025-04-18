<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}{{ required ? '*' : '' }}</label>
    <Calendar
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :dateFormat="dateFormat"
      :showIcon="true"
      iconDisplay="input"
      :class="{ 'p-invalid': error }"
      v-bind="$attrs"
    />
    <small v-if="error" class="p-error">{{ error }}</small>
  </div>
</template>

<script setup>
import Calendar from 'primevue/calendar'

const props = defineProps({
  modelValue: {
    type: Date,
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
  dateFormat: {
    type: String,
    default: 'dd.mm.yy'
  }
})

defineEmits(['update:modelValue'])
</script> 