/* eslint-disable max-lines */

import { GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';

import withAuth from '@/components/Auth/withAuth';
import NextSeoWrapper from '@/components/NextSeoWrapper';
import { NotificationsProvider } from '@/components/Notifications/InAppNotifications/NotificationContext';
import NotificationSettingsTabs from '@/components/Notifications/NotificationSettings/Tabs';
import layoutStyles from '@/pages/index.module.scss';
import { getAllChaptersData } from '@/utils/chapter';
import { getLanguageAlternates } from '@/utils/locale';
import { getCanonicalUrl, getNotificationSettingsNavigationUrl } from '@/utils/navigation';

const NotificationSettingsPage = () => {
  const { t, lang } = useTranslation('common');
  const navigationUrl = getNotificationSettingsNavigationUrl();
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  return (
    <>
      <NextSeoWrapper
        title={t('notification-settings')}
        canonical={getCanonicalUrl(lang, navigationUrl)}
        languageAlternates={getLanguageAlternates(navigationUrl)}
        nofollow
        noindex
      />
      <div className={layoutStyles.pageContainer}>
        <div className={layoutStyles.flow}>
          <div className={layoutStyles.flowItem}>
            <NotificationsProvider>
              <NotificationSettingsTabs />
            </NotificationsProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const allChaptersData = await getAllChaptersData(locale);

  return {
    props: {
      chaptersData: allChaptersData,
    },
  };
};

export default withAuth(NotificationSettingsPage);
