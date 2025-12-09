import React, { useState } from 'react';
import type { Zone, Asset } from '../structure_types';

/**
 * LEZIONE 3: La Ricorsione Visuale
 * 
 * Questo componente richiama SÉ STESSO.
 * Se una Zona ha delle sotto-zone, creremo un nuovo <ZoneTreeItem> dentro.
 * Questo ci permette di disegnare alberi infiniti.
 */

interface Props {
    zone: Zone;
    onSelect: (item: Zone | Asset) => void;
    selectedId?: string;
    depth?: number; // Per l'indentazione (se non usassimo CSS)
}

export const ZoneTreeItem: React.FC<Props> = ({ zone, onSelect, selectedId }) => {
    const [isOpen, setIsOpen] = useState(true); // Default aperto



    // Calcolo veloce dei rischi totali in questa zona (esercizio semplice)
    const assetCount = zone.assets.length;
    const subZoneCount = zone.subZones.length;

    return (
        <div className="tree-node">
            {/* 1. L'Intestazione della Zona (es. "Cucina") */}
            <div
                className={`tree-item ${selectedId === zone.id ? 'active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(zone);
                    setIsOpen(!isOpen);
                }}
            >
                <div className="tree-item-content-wrapper">
                    <span className="icon-folder">{isOpen ? '📂' : '📁'}</span>
                    <span className="tree-label">{zone.name}</span>
                </div>
                <span className="tree-meta">
                    ({subZoneCount} zone, {assetCount} asset)
                </span>
            </div>

            {/* 2. Il Contenuto (Figli) - Visibile solo se "isOpen" è true */}
            {isOpen && (
                <div style={{ marginLeft: '4px' }}>

                    {/* A. Disegniamo le SOTTO-ZONE (Ricorsione!) */}
                    {zone.subZones.map(sub => (
                        <ZoneTreeItem
                            key={sub.id}
                            zone={sub}
                            onSelect={onSelect}
                            selectedId={selectedId}
                        />
                    ))}

                    {/* B. Disegniamo gli ELEMENTI (Assets) di questa zona */}
                    {zone.assets.map(asset => (
                        <div
                            key={asset.id}
                            className={`tree-item asset-item ${selectedId === asset.id ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(asset);
                            }}
                        >
                            <div className="tree-item-content-wrapper">
                                <span className="icon-asset">🔧</span>
                                <span className="tree-label">{asset.name}</span>
                            </div>

                            {asset.risks.length > 0 && (
                                <span className="risk-count">{asset.risks.length}</span>
                            )}
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};
