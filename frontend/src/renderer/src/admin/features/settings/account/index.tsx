import { SettingsShell } from '../settings-shell'
import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <SettingsShell>
      <ContentSection
        title="Tài khoản"
        desc="Cập nhật cài đặt tài khoản, chọn ngôn ngữ và ngày sinh."
      >
        <AccountForm />
      </ContentSection>
    </SettingsShell>
  )
}
