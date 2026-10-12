import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import { setProjectAnnotations } from '@storybook/react-vite'
import * as previewAnnotations from './preview'

// Applies the Storybook preview (decorators, a11y "error" mode) to every story run as a test.
setProjectAnnotations([a11yAddonAnnotations, previewAnnotations])
