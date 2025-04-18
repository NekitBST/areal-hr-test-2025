<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}{{ required ? '*' : '' }}</label>
    <Password
      v-if="type === 'password'"
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :class="{ 'p-invalid': error }"
      :feedback="false"
      :toggleMask="true"
      v-bind="$attrs"
    />
    <InputText
      v-else
      :id="id"
      :type="type"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :class="{ 'p-invalid': error }"
      v-bind="$attrs"
    />
    <small v-if="error" class="p-error">{{ error }}</small>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

const props = defineProps({
  modelValue: {
    type: [String, Number],
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
  type: {
    type: String,
    default: 'text'
  }
})

defineEmits(['update:modelValue'])
</script> 