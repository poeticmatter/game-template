import { FieldLabel, SegmentedControl, type SettingsFormProps } from 'game-kit/simultaneous'
import type { RpsSettings } from './types'

const TARGET_SCORE_OPTIONS = [1, 3, 5]

export function RpsSettingsForm({ settings, onChange }: SettingsFormProps<RpsSettings>) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>First to</FieldLabel>
      <SegmentedControl<number>
        options={TARGET_SCORE_OPTIONS}
        value={settings.targetScore}
        onChange={targetScore => onChange({ ...settings, targetScore })}
      />
    </div>
  )
}
