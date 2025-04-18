<template>
  <Button
    v-bind="$attrs"
    :label="computedLabel"
    :icon="computedIcon"
    :loading="loading"
    :disabled="disabled"
    :class="buttonClass"
    :severity="computedSeverity"
    :text="computedText"
    @click="$emit('click', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'text', 'danger', 'info'].includes(value)
  },
  severity: {
    type: String,
    default: null,
    validator: (value) => !value || ['success', 'info', 'warn', 'danger', 'secondary', 'help'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: false
  },
  action: {
    type: String,
    default: '',
    validator: (value) => !value || ['view', 'edit', 'delete', 'save', 'cancel', 'create', 'upload'].includes(value)
  }
})

const actionConfig = {
  view: {
    icon: 'pi pi-eye',
    severity: 'info',
    text: true,
    rounded: true
  },
  edit: {
    icon: 'pi pi-pencil',
    severity: 'info',
    text: true,
    rounded: true
  },
  delete: {
    icon: 'pi pi-trash',
    severity: 'danger',
    text: true,
    rounded: true
  },

  save: {
    icon: 'pi pi-check',
    label: 'Сохранить',
    severity: null,
    text: false
  },
  cancel: {
    icon: 'pi pi-times',
    label: 'Отмена',
    text: true
  },

  create: {
    icon: 'pi pi-plus',
    label: 'Создать',
    severity: null,
    text: false
  },
  upload: {
    icon: 'pi pi-upload',
    label: 'Загрузить',
    severity: null,
    text: false
  }
}

const computedIcon = computed(() => {
  if (props.icon) return props.icon
  return props.action ? actionConfig[props.action]?.icon : ''
})

const computedLabel = computed(() => {
  if (props.label) return props.label
  return props.action ? actionConfig[props.action]?.label : ''
})

const computedSeverity = computed(() => {
  if (props.severity) return props.severity
  return props.action ? actionConfig[props.action]?.severity : null
})

const computedText = computed(() => {
  if (props.variant === 'text') return true
  return props.action ? actionConfig[props.action]?.text : false
})

const buttonClass = computed(() => {
  return {
    'p-button-secondary': props.variant === 'secondary' && !props.severity,
    'p-button-danger': props.variant === 'danger' && !props.severity,
    'p-button-info': props.variant === 'info' && !props.severity,
    'p-button-rounded': props.rounded || (props.action && actionConfig[props.action]?.rounded)
  }
})

defineEmits(['click'])
</script> 