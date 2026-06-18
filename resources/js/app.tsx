import { createInertiaApp, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import type { ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pages = import.meta.glob<{ default: StorefrontPageComponent }>(
    './pages/**/*.tsx',
);

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        void navigator.serviceWorker.register('/sw.js');
    });
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, pages).then(
            (module) => module.default as unknown as ResolvedComponent,
        ),
    setup({ el, App, props }) {
        const app = (
            <StrictMode>
                <App {...props}>
                    {({ Component, props: pageProps, key }) => (
                        <PageWithLayout
                            Component={Component as StorefrontPageComponent}
                            pageProps={pageProps}
                            pageKey={key}
                        />
                    )}
                </App>
                <Toaster />
            </StrictMode>
        );

        if (!el) {
            return app;
        }

        if (el.hasAttribute('data-server-rendered')) {
            el.removeAttribute('data-server-rendered');
            el.innerHTML = '';
        }

        window.mmdecorInertiaRoot ??= createRoot(el);
        window.mmdecorInertiaRoot.render(app);
    },
    progress: {
        color: '#4B5563',
    },
});

declare global {
    interface Window {
        mmdecorInertiaRoot?: Root;
    }
}

// This will set light / dark mode on load...
initializeTheme();

type LayoutProps = Record<string, unknown>;

type StorefrontPageComponent = ComponentType<PageProps> & {
    layout?: LayoutProps | ((page: ReactElement) => ReactNode);
};

function PageWithLayout({
    Component,
    pageProps,
    pageKey,
}: {
    Component: StorefrontPageComponent;
    pageProps: PageProps;
    pageKey: number | null;
}) {
    const page = usePage();
    const child = <Component key={pageKey} {...pageProps} />;

    if (typeof Component.layout === 'function') {
        return <>{Component.layout(child)}</>;
    }

    const layoutProps = isLayoutProps(Component.layout)
        ? Component.layout
        : {};
    const componentName = page.component;

    if (componentName === 'welcome') {
        return child;
    }

    if (componentName.startsWith('auth/')) {
        return <AuthLayout {...layoutProps}>{child}</AuthLayout>;
    }

    if (componentName.startsWith('settings/')) {
        return (
            <AppLayout {...layoutProps}>
                <SettingsLayout>{child}</SettingsLayout>
            </AppLayout>
        );
    }

    return <AppLayout {...layoutProps}>{child}</AppLayout>;
}

function isLayoutProps(layout: unknown): layout is LayoutProps {
    return Boolean(layout) && typeof layout === 'object' && !Array.isArray(layout);
}
