<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}{{ required ? '*' : '' }}</label>
    <Textarea
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :class="{ 'p-invalid': error }"
      :rows="rows"
      v-bind="$attrs"
    />
    <small v-if="error" class="p-error">{{ error }}</small>
  </div>
</template>

<script setup>
import Textarea from 'primevue/textarea'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
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
  rows: {
    type: Number,
    default: 3
  }
})

defineEmits(['update:modelValue'])
</script> 