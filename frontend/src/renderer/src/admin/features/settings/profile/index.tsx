import { SettingsShell } from '../settings-shell'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <SettingsShell>
      <ContentSection title="Hồ sơ" desc="Đây là cách người khác nhìn thấy bạn.">
        <ProfileForm />
      </ContentSection>
    </SettingsShell>
  )
}
