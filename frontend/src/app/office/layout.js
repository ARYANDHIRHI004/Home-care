import OfficeLayoutClient from '@/components/office/OfficeLayoutClient';

export default function OfficeLayout({ children }) {
    return (
        <OfficeLayoutClient>
            {children}
        </OfficeLayoutClient>
    );
}
