import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { findFirstSidebarItemLink, useDocById } from '@docusaurus/theme-common/internal';
import { usePluralForm } from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

function startWithEmoji(title) {
    return /^\p{So}/u.test(title);
}

function useCategoryItemsPlural() {
    const {selectMessage} = usePluralForm();
    return (count) =>
        selectMessage(
            count,
            translate(
                {
                    message: '{count} items',
                    id: 'theme.docs.DocCard.categoryDescription.plurals',
                    description:
                        'The default description for a category card in the generated index about how many items this category includes',
                },
                {count},
            ),
        );
}

function CardContainer({href, children, customCardClass}) {
    return (
        <Link
            href={href}
            className={clsx('card padding--lg', styles.cardContainer)}>
            {children}
        </Link>
    );
}

function CardLayout({href, icon, title, description}) {
    return (
        <CardContainer href={href}>
            <h2 className={clsx('text--truncate', styles.cardTitle)} title={title}>
                {icon !== '' ? icon + ' ' : ''}{title}
            </h2>
            {description && (
                <p
                    className={clsx('text--truncate', styles.cardDescription)}
                    title={description}>
                    {description}
                </p>
            )}
        </CardContainer>
    );
}

function CardCategory({item}) {
    const href = findFirstSidebarItemLink(item);
    // Unexpected: categories that don't have a link have been filtered upfront
    if (!href) {
        return null;
    }
    const categoryItemsPlural = useCategoryItemsPlural();

    return (
        <CardLayout
            href={href}
            icon={startWithEmoji(item.label) ? "" : "🗃️"}
            title={item.label}
            description={item.description ?? categoryItemsPlural(item.items.length)}
        />
    );
}

function CardLink({item}) {
    const icon = isInternalUrl(item.href) ? '📄️' : '🔗';
    const doc = useDocById(item.docId ?? undefined);
    return (
        <CardLayout
            href={item.href}
            icon={startWithEmoji(item.label) ? '' : icon}
            title={item.label}
            description={item.description ?? doc?.description}
        />
    );
}

export default function DocCard({item}) {
    switch (item.type) {
        case 'link':
            return <CardLink item={item}/>;
        case 'category':
            return <CardCategory item={item}/>;
        default:
            throw new Error(`unknown item type ${JSON.stringify(item)}`);
    }
}
