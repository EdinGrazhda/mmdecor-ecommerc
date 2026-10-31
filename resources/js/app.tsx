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
    resolve: async (name) => {
        const module = await resolvePageComponent(`./pages/${name}.tsx`, pages);
        const Component = module.default as StorefrontPageComponent;

        if (name === 'welcome' || name.startsWith('store/')) {
            return Component as unknown as ResolvedComponent;
        }

        if (name.startsWith('auth/')) {
            Component.authLayout = (await import('@/layouts/auth-layout'))
                .default as PageLayoutComponent;
        } else if (name.startsWith('settings/')) {
            const [appLayout, settingsLayout] = await Promise.all([
                import('@/layouts/app-layout'),
                import('@/layouts/settings/layout'),
            ]);
            Component.appLayout = appLayout.default as PageLayoutComponent;
            Component.settingsLayout =
                settingsLayout.default as PageLayoutComponent;
        } else {
            Component.appLayout = (await import('@/layouts/app-layout'))
                .default as PageLayoutComponent;
        }

        return Component as unknown as ResolvedComponent;
    },
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
    appLayout?: PageLayoutComponent;
    authLayout?: PageLayoutComponent;
    settingsLayout?: PageLayoutComponent;
};

type PageLayoutComponent = ComponentType<LayoutProps & { children: ReactNode }>;

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

    const layoutProps = isLayoutProps(Component.layout) ? Component.layout : {};
    const componentName = page.component;

    if (componentName === 'welcome' || componentName.startsWith('store/')) {
        return child;
    }

    if (componentName.startsWith('auth/')) {
        const Layout = Component.authLayout;

        return Layout ? <Layout {...layoutProps}>{child}</Layout> : child;
    }

    if (componentName.startsWith('settings/')) {
        const Layout = Component.appLayout;
        const Settings = Component.settingsLayout;

        if (!Layout || !Settings) {
            return child;
        }

        return (
            <Layout {...layoutProps}>
                <Settings>{child}</Settings>
            </Layout>
        );
    }

    const Layout = Component.appLayout;

    return Layout ? <Layout {...layoutProps}>{child}</Layout> : child;
}

function isLayoutProps(layout: unknown): layout is LayoutProps {
    return (
        Boolean(layout) && typeof layout === 'object' && !Array.isArray(layout)
    );
}
