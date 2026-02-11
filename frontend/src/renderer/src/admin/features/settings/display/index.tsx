import { SettingsShell } from '../settings-shell'
import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'

export function SettingsDisplay() {
  return (
    <SettingsShell>
      <ContentSection title="Hiển thị" desc="Bật hoặc tắt các mục để kiểm soát những gì hiển thị.">
        <DisplayForm />
      </ContentSection>
    </SettingsShell>
  )
}
