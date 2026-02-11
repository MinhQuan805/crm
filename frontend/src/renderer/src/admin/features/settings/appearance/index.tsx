import { SettingsShell } from '../settings-shell'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <SettingsShell>
      <ContentSection
        title="Giao diện"
        desc="Tùy chỉnh giao diện, tự động chuyển đổi giữa chế độ sáng và tối."
      >
        <AppearanceForm />
      </ContentSection>
    </SettingsShell>
  )
}
