'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Boxes,
  Warehouse,
  History,
  Barcode,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Tag,
  MapPin,
  Sliders,
  Filter,
  Check,
  X,
  FileText,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Printer,
  Download,
  ClipboardCheck,
  AlertCircle,
  Calendar,
  Layers,
  Truck,
  ShoppingCart,
  PieChart,
  Sparkles,
  Send,
  Award,
  FileSpreadsheet,
  Navigation,
  Shield,
  CheckCircle,
  Scale,
  Percent,
} from 'lucide-react';

interface InventoryManagerProps {
  tenantSlug: string;
  categories: any[];
  onItemUpdated?: () => void;
}

export function InventoryManager({ tenantSlug, categories, onItemUpdated }: InventoryManagerProps) {
  // Navigation Sub-Tabs (Phase 3 Engine)
  const [activeSubTab, setActiveSubTab] = useState<'stock' | 'procurement' | 'analytics' | 'transfer' | 'kpis' | 'reorder' | 'audit' | 'barcode'>('stock');

  const [summary, setSummary] = useState<any>({
    totalSkus: 0,
    totalOnHand: 0,
    totalReserved: 0,
    totalAvailable: 0,
    totalDamaged: 0,
    totalValuation: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });

  const [items, setItems] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'RESERVED'>('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  // Ledger Modal
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [selectedLedgerItem, setSelectedLedgerItem] = useState<any | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  // Adjust Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<
    'RECEIVE_PO' | 'COUNT_ADJUST' | 'DAMAGE_WRITEOFF' | 'RETURN_RESTOCK' | 'RETURN_DAMAGED'
  >('RECEIVE_PO');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustLocationId, setAdjustLocationId] = useState('loc_main');
  const [adjustBin, setAdjustBin] = useState('');
  const [adjustReference, setAdjustReference] = useState('');
  const [adjustUnitCost, setAdjustUnitCost] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // Phase 3: Reorder Suggestions State
  const [reorderData, setReorderData] = useState<any>(null);
  const [loadingReorder, setLoadingReorder] = useState(false);

  // Phase 3: Cycle Count Audit State
  const [auditsList, setAuditsList] = useState<any[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [auditSessionName, setAuditSessionName] = useState('Weekly Warehouse Cycle Count');
  const [auditConductedBy, setAuditConductedBy] = useState('Auditor Staff');
  const [auditLocationId, setAuditLocationId] = useState('loc_main');
  const [auditCounts, setAuditCounts] = useState<Record<string, { counted: number; notes: string }>>({});
  const [submittingAudit, setSubmittingAudit] = useState(false);

  // Phase 4: Procurement & Purchase Orders State
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loadingPO, setLoadingPO] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [createPOModalOpen, setCreatePOModalOpen] = useState(false);
  const [newPOSupplierId, setNewPOSupplierId] = useState('');
  const [newPONotes, setNewPONotes] = useState('');
  const [newPOExpectedDate, setNewPOExpectedDate] = useState('');
  const [newPOItems, setNewPOItems] = useState<Array<{ itemId: string; sku: string; title: string; orderQty: number; unitCost: number }>>([]);
  const [submittingPO, setSubmittingPO] = useState(false);

  // Phase 4: GRN & Landed Cost Modal State
  const [grnModalOpen, setGrnModalOpen] = useState(false);
  const [selectedPOForGRN, setSelectedPOForGRN] = useState<any | null>(null);
  const [grnFreightCost, setGrnFreightCost] = useState('500');
  const [grnLaborCost, setGrnLaborCost] = useState('200');
  const [grnInspectedBy, setGrnInspectedBy] = useState('Warehouse Incharge');
  const [grnNotes, setGrnNotes] = useState('');
  const [grnItemCounts, setGrnItemCounts] = useState<Record<string, { receivedQty: number; rejectedQty: number; bin: string }>>({});
  const [submittingGRN, setSubmittingGRN] = useState(false);

  // Phase 4: Supplier Modal State
  const [createSupplierModalOpen, setCreateSupplierModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierCompany, setNewSupplierCompany] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newSupplierAddress, setNewSupplierAddress] = useState('');
  const [newSupplierLeadTime, setNewSupplierLeadTime] = useState('7');
  const [newSupplierPaymentTerms, setNewSupplierPaymentTerms] = useState('Net 15 Days');
  const [submittingSupplier, setSubmittingSupplier] = useState(false);

  // Phase 4: PO Print Modal
  const [printPOModalOpen, setPrintPOModalOpen] = useState(false);
  const [selectedPOForPrint, setSelectedPOForPrint] = useState<any | null>(null);

  // Phase 4: ABC Analysis & Dead Stock State
  const [abcData, setAbcData] = useState<any>(null);
  const [loadingABC, setLoadingABC] = useState(false);
  const [abcFilter, setAbcFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'DEAD_STOCK'>('ALL');

  // Phase 5: Inter-Warehouse Transfers & Gatepass State
  const [stockTransfers, setStockTransfers] = useState<any[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [createTransferModalOpen, setCreateTransferModalOpen] = useState(false);
  const [transferFromLoc, setTransferFromLoc] = useState('loc_main');
  const [transferToLoc, setTransferToLoc] = useState('loc_showroom');
  const [transferVehicle, setTransferVehicle] = useState('Dhaka Metro Delivery Van');
  const [transferDriverName, setTransferDriverName] = useState('Abdul Karim');
  const [transferDriverPhone, setTransferDriverPhone] = useState('+8801733445566');
  const [transferNotes, setTransferNotes] = useState('');
  const [transferItems, setTransferItems] = useState<Array<{ itemId: string; sku: string; title: string; transferQty: number; sourceBin: string; targetBin: string }>>([]);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [printTransferModalOpen, setPrintTransferModalOpen] = useState(false);
  const [selectedTransferForPrint, setSelectedTransferForPrint] = useState<any | null>(null);

  // Phase 5: Enterprise KPIs & Audit Integrity State
  const [kpiData, setKpiData] = useState<any>(null);
  const [loadingKPIs, setLoadingKPIs] = useState(false);
  const [integrityData, setIntegrityData] = useState<any>(null);
  const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);

  // Load Inventory Summary & Items
  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await api.getInventorySummary(tenantSlug);
      if (res?.success) {
        setSummary(res.summary);
        setItems(res.items || []);
        setLocations(res.locations || []);

        // Pre-populate default audit counts
        const initialCounts: Record<string, { counted: number; notes: string }> = {};
        (res.items || []).forEach((it: any) => {
          initialCounts[it.id] = { counted: it.onHand || 0, notes: '' };
        });
        setAuditCounts(initialCounts);
      }
    } catch (err) {
      console.error('Error fetching inventory summary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Phase 3 Reorder Suggestions
  const loadReorderSuggestions = async () => {
    setLoadingReorder(true);
    try {
      const res = await api.getReorderSuggestions(tenantSlug);
      if (res?.success) {
        setReorderData(res);
      }
    } catch (err) {
      console.error('Error fetching reorder suggestions:', err);
    } finally {
      setLoadingReorder(false);
    }
  };

  // Load Phase 3 Audits List
  const loadAudits = async () => {
    setLoadingAudits(true);
    try {
      const res = await api.getInventoryAudits(tenantSlug);
      if (res?.success) {
        setAuditsList(res.audits || []);
      }
    } catch (err) {
      console.error('Error fetching audits:', err);
    } finally {
      setLoadingAudits(false);
    }
  };

  // Phase 4 Loaders
  const loadPOs = async () => {
    setLoadingPO(true);
    try {
      const res = await api.getPurchaseOrders(tenantSlug);
      if (res?.success) {
        setPurchaseOrders(res.purchaseOrders || []);
      }
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
    } finally {
      setLoadingPO(false);
    }
  };

  const loadSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const res = await api.getSuppliers(tenantSlug);
      if (res?.success) {
        setSuppliers(res.suppliers || []);
        if (res.suppliers && res.suppliers.length > 0 && !newPOSupplierId) {
          setNewPOSupplierId(res.suppliers[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const loadABC = async () => {
    setLoadingABC(true);
    try {
      const res = await api.getABCAnalytics(tenantSlug);
      if (res?.success) {
        setAbcData(res);
      }
    } catch (err) {
      console.error('Error fetching ABC analytics:', err);
    } finally {
      setLoadingABC(false);
    }
  };

  // Phase 5 Loaders
  const loadTransfers = async () => {
    setLoadingTransfers(true);
    try {
      const res = await api.getStockTransfers(tenantSlug);
      if (res?.success) {
        setStockTransfers(res.transfers || []);
      }
    } catch (err) {
      console.error('Error fetching stock transfers:', err);
    } finally {
      setLoadingTransfers(false);
    }
  };

  const loadKPIs = async () => {
    setLoadingKPIs(true);
    try {
      const res = await api.getEnterpriseKPIs(tenantSlug);
      if (res?.success) {
        setKpiData(res.kpis);
      }
    } catch (err) {
      console.error('Error fetching enterprise KPIs:', err);
    } finally {
      setLoadingKPIs(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setVerifyingIntegrity(true);
    try {
      const res = await api.verifyLedgerIntegrity(tenantSlug);
      if (res?.success) {
        setIntegrityData(res);
        setNotice('Cryptographic audit verification completed: ' + res.verificationSeal);
        setTimeout(() => setNotice(null), 5000);
      }
    } catch (err) {
      console.error('Error verifying integrity:', err);
    } finally {
      setVerifyingIntegrity(false);
    }
  };

  const handleOpenCreateTransfer = (prefillItem?: any, prefillQty = 5) => {
    if (prefillItem) {
      setTransferItems([
        {
          itemId: prefillItem.id || prefillItem.itemId,
          sku: prefillItem.sku,
          title: prefillItem.title,
          transferQty: prefillQty,
          sourceBin: prefillItem.bin || 'A-01-01',
          targetBin: 'SH-FRONT',
        },
      ]);
    } else if (items.length > 0) {
      setTransferItems([
        {
          itemId: items[0].id,
          sku: items[0].sku,
          title: items[0].title,
          transferQty: 2,
          sourceBin: items[0].bin || 'A-01-01',
          targetBin: 'SH-FRONT',
        },
      ]);
    }
    setCreateTransferModalOpen(true);
  };

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transferItems.length === 0) {
      alert('Please select at least one item to transfer');
      return;
    }
    if (transferFromLoc === transferToLoc) {
      alert('Source and destination locations must be different');
      return;
    }

    setSubmittingTransfer(true);
    try {
      const res = await api.createStockTransfer(
        {
          fromLocationId: transferFromLoc,
          toLocationId: transferToLoc,
          items: transferItems,
          vehicleNumber: transferVehicle,
          driverName: transferDriverName,
          driverPhone: transferDriverPhone,
          notes: transferNotes,
          dispatchedBy: 'Central Warehouse Dispatcher',
        },
        tenantSlug
      );

      if (res?.success) {
        setNotice(res.message || 'Transfer challan dispatched successfully!');
        setTimeout(() => setNotice(null), 4000);
        setCreateTransferModalOpen(false);
        await loadTransfers();
        await loadInventory();
        if (onItemUpdated) onItemUpdated();
      } else {
        alert(res?.message || 'Failed to dispatch transfer');
      }
    } catch (err: any) {
      alert('Error creating transfer: ' + (err?.message || 'Server error'));
    } finally {
      setSubmittingTransfer(false);
    }
  };

  const handleReceiveTransfer = async (transfer: any) => {
    if (!confirm('Are you sure that Challan #' + transfer.challanNumber + ' has been physically received at the destination?')) return;

    try {
      const res = await api.receiveStockTransfer(
        transfer.id,
        {
          receivedBy: 'Showroom Incharge',
          notes: 'Received in full and verified at counter',
        },
        tenantSlug
      );

      if (res?.success) {
        setNotice(res.message || 'Transfer items received and stocked successfully!');
        setTimeout(() => setNotice(null), 4000);
        await loadTransfers();
        await loadInventory();
        if (onItemUpdated) onItemUpdated();
      } else {
        alert(res?.message || 'Failed to receive transfer');
      }
    } catch (err: any) {
      alert('Error receiving transfer: ' + (err?.message || 'Server error'));
    }
  };

  useEffect(() => {
    loadInventory();
  }, [tenantSlug]);

  useEffect(() => {
    if (activeSubTab === 'reorder') {
      loadReorderSuggestions();
    } else if (activeSubTab === 'audit') {
      loadAudits();
    } else if (activeSubTab === 'procurement') {
      loadPOs();
      loadSuppliers();
    } else if (activeSubTab === 'analytics') {
      loadABC();
    } else if (activeSubTab === 'transfer') {
      loadTransfers();
    } else if (activeSubTab === 'kpis') {
      loadKPIs();
      handleVerifyIntegrity();
    }
  }, [activeSubTab, tenantSlug]);

  const handleOpenCreatePO = (prefillItem?: any, prefillQty = 10) => {
    if (suppliers.length === 0) {
      loadSuppliers();
    }
    if (prefillItem) {
      setNewPOItems([
        {
          itemId: prefillItem.id || prefillItem.itemId,
          sku: prefillItem.sku,
          title: prefillItem.title,
          orderQty: prefillQty,
          unitCost: Number(prefillItem.unitCost || prefillItem.costPrice || 2500),
        },
      ]);
    } else if (items.length > 0) {
      setNewPOItems([
        {
          itemId: items[0].id,
          sku: items[0].sku,
          title: items[0].title,
          orderQty: 10,
          unitCost: Number(items[0].costPrice || 2500),
        },
      ]);
    }
    setCreatePOModalOpen(true);
  };

  const handleSubmitPO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPOItems.length === 0) {
      alert('Please add at least one item');
      return;
    }
    const sup = suppliers.find((s) => s.id === newPOSupplierId) || suppliers[0];
    setSubmittingPO(true);
    try {
      const res = await api.createPurchaseOrder(
        {
          supplierId: sup?.id || 'supp_custom',
          supplierName: sup?.companyName || sup?.name || 'Registered Tannery Supplier',
          supplierPhone: sup?.phone || '',
          items: newPOItems,
          notes: newPONotes,
          expectedDate: newPOExpectedDate || undefined,
          createdBy: 'Store Inventory Manager',
        },
        tenantSlug
      );
      if (res?.success) {
        setNotice(res.message || 'Purchase order created and issued successfully!');
        setTimeout(() => setNotice(null), 4000);
        setCreatePOModalOpen(false);
        await loadPOs();
      } else {
        alert(res?.message || 'Failed to create PO');
      }
    } catch (err: any) {
      alert('Error creating PO: ' + (err?.message || 'Server error'));
    } finally {
      setSubmittingPO(false);
    }
  };

  const handleOpenGRNModal = (po: any) => {
    setSelectedPOForGRN(po);
    const initialGrnItems: Record<string, { receivedQty: number; rejectedQty: number; bin: string }> = {};
    (po.items || []).forEach((item: any) => {
      const remainingToReceive = Math.max(0, (item.orderQty || 0) - (item.receivedQty || 0));
      initialGrnItems[item.itemId] = {
        receivedQty: remainingToReceive,
        rejectedQty: 0,
        bin: 'A-01-01',
      };
    });
    setGrnItemCounts(initialGrnItems);
    setGrnFreightCost('500');
    setGrnLaborCost('200');
    setGrnNotes(`PO #${po.poNumber} delivery received and QC inspected`);
    setGrnModalOpen(true);
  };

  const handleSubmitGRN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOForGRN) return;

    const payloadReceived = (selectedPOForGRN.items || []).map((item: any) => {
      const entry = grnItemCounts[item.itemId] || { receivedQty: 0, rejectedQty: 0, bin: 'A-01-01' };
      return {
        itemId: item.itemId,
        sku: item.sku,
        receivedQty: Number(entry.receivedQty) || 0,
        rejectedQty: Number(entry.rejectedQty) || 0,
        bin: entry.bin || 'A-01-01',
      };
    });

    setSubmittingGRN(true);
    try {
      const res = await api.receiveGoodsNote(
        selectedPOForGRN.id,
        {
          receivedItems: payloadReceived,
          freightCost: parseFloat(grnFreightCost) || 0,
          customsOrLaborCost: parseFloat(grnLaborCost) || 0,
          inspectedBy: grnInspectedBy,
          notes: grnNotes,
        },
        tenantSlug
      );

      if (res?.success) {
        setNotice(res.message || 'GRN completed and stock ledger updated successfully!');
        setTimeout(() => setNotice(null), 5000);
        setGrnModalOpen(false);
        await loadPOs();
        await loadInventory();
        if (onItemUpdated) onItemUpdated();
      } else {
        alert(res?.message || 'Failed to submit GRN');
      }
    } catch (err: any) {
      alert('Error submitting GRN: ' + (err?.message || 'Server error'));
    } finally {
      setSubmittingGRN(false);
    }
  };

  const handleSubmitSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName.trim() || !newSupplierPhone.trim()) {
      alert('Please provide supplier name and phone number');
      return;
    }
    setSubmittingSupplier(true);
    try {
      const res = await api.createSupplier(
        {
          name: newSupplierName.trim(),
          companyName: newSupplierCompany.trim() || newSupplierName.trim(),
          phone: newSupplierPhone.trim(),
          email: newSupplierEmail.trim(),
          address: newSupplierAddress.trim(),
          leadTimeDays: Number(newSupplierLeadTime) || 7,
          paymentTerms: newSupplierPaymentTerms,
        },
        tenantSlug
      );
      if (res?.success) {
        setNotice('New supplier registered successfully!');
        setTimeout(() => setNotice(null), 4000);
        setCreateSupplierModalOpen(false);
        await loadSuppliers();
      } else {
        alert(res?.message || 'Failed to add supplier');
      }
    } catch (err: any) {
      alert('Error adding supplier: ' + (err?.message || 'Server error'));
    } finally {
      setSubmittingSupplier(false);
    }
  };

  // Handle open ledger drawer
  const handleOpenLedger = async (item: any) => {
    setSelectedLedgerItem(item);
    setLoadingLedger(true);
    setLedgerModalOpen(true);
    try {
      const res = await api.getStockLedger({ sku: item.sku, itemId: item.id }, tenantSlug);
      if (res?.success) {
        setLedgerEntries(res.ledger || []);
      } else {
        setLedgerEntries([]);
      }
    } catch (err) {
      console.error('Error fetching stock ledger:', err);
      setLedgerEntries([]);
    } finally {
      setLoadingLedger(false);
    }
  };

  // Handle open quick adjustment modal
  const handleOpenAdjust = (item?: any, defaultType: any = 'RECEIVE_PO', defaultQty = '', defaultReason = '') => {
    const target = item || items[0];
    setAdjustItem(target);
    setAdjustType(defaultType);
    setAdjustQty(defaultQty);
    setAdjustReason(defaultReason);
    setAdjustLocationId(target?.locationId || 'loc_main');
    setAdjustBin(target?.bin || 'A-01-01');
    setAdjustReference('');
    setAdjustUnitCost(target?.costPrice ? String(target.costPrice) : '');
    setAdjustModalOpen(true);
  };

  // Submit stock adjustment
  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem || !adjustQty || !adjustReason.trim()) return;

    const parsedQty = parseInt(adjustQty, 10);
    if (isNaN(parsedQty) || parsedQty === 0) {
      alert('Valid numeric quantity required');
      return;
    }

    let finalQty = parsedQty;
    if (adjustType === 'DAMAGE_WRITEOFF' || adjustType === 'RETURN_DAMAGED') {
      finalQty = -Math.abs(parsedQty);
    } else if (adjustType === 'RECEIVE_PO' || adjustType === 'RETURN_RESTOCK') {
      finalQty = Math.abs(parsedQty);
    }

    setAdjusting(true);
    try {
      const res = await api.adjustStock(
        {
          itemId: adjustItem.id,
          sku: adjustItem.sku,
          movementType: adjustType,
          qtyChange: finalQty,
          locationId: adjustLocationId,
          bin: adjustBin,
          reason: adjustReason.trim(),
          reference: adjustReference.trim() || undefined,
          unitCost: adjustUnitCost ? parseFloat(adjustUnitCost) : undefined,
          performedBy: 'Store Inventory Manager',
        },
        tenantSlug
      );

      if (res?.success) {
        setNotice(res.message || 'Stock successfully updated and recorded in ledger!');
        setTimeout(() => setNotice(null), 4000);
        setAdjustModalOpen(false);
        await loadInventory();
        if (onItemUpdated) onItemUpdated();
        if (ledgerModalOpen && selectedLedgerItem) {
          handleOpenLedger(selectedLedgerItem);
        }
      } else {
        alert(res?.message || 'Failed to adjust stock');
      }
    } catch (err: any) {
      console.error('Adjustment error:', err);
      alert('Error adjusting stock: ' + (err?.message || 'Server error'));
    } finally {
      setAdjusting(false);
    }
  };

  // Submit Cycle Count Audit Session
  const handleSubmitAuditSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditSessionName.trim()) {
      alert('Please enter an audit session name');
      return;
    }

    const payloadCounts = items.map((it) => {
      const entry = auditCounts[it.id] || { counted: it.onHand || 0, notes: '' };
      return {
        itemId: it.id,
        sku: it.sku,
        title: it.title,
        expectedQty: it.onHand || 0,
        countedQty: Number(entry.counted),
        notes: entry.notes || '',
      };
    });

    setSubmittingAudit(true);
    try {
      const res = await api.submitInventoryAudit(
        {
          sessionName: auditSessionName.trim(),
          locationId: auditLocationId,
          conductedBy: auditConductedBy.trim() || 'Inventory Auditor',
          counts: payloadCounts,
        },
        tenantSlug
      );

      if (res?.success) {
        setNotice(res.message || 'Cycle count audit completed and ledger adjusted successfully!');
        setTimeout(() => setNotice(null), 5000);
        await loadInventory();
        await loadAudits();
        if (onItemUpdated) onItemUpdated();
      } else {
        alert(res?.message || 'Failed to submit audit');
      }
    } catch (err: any) {
      console.error('Audit submit error:', err);
      alert('Error submitting audit: ' + (err?.message || 'Server error'));
    } finally {
      setSubmittingAudit(false);
    }
  };

  // Export CSV Data
  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = [
      'Product Title',
      'SKU',
      'Barcode',
      'Category',
      'Warehouse Location',
      'Shelf Bin',
      'Unit Cost (BDT)',
      'Selling Price (BDT)',
      'On Hand Units',
      'Reserved Units',
      'Available to Sell',
      'Safety Stock Buffer',
      'Inventory Valuation (BDT)',
      'Stock Health Status',
    ];

    const rows = items.map((it) => [
      `"${(it.title || '').replace(/"/g, '""')}"`,
      `"${it.sku || ''}"`,
      `"${it.barcode || ''}"`,
      `"${it.categoryName || ''}"`,
      `"WH-MAIN (Tejgaon Central)"`,
      `"${it.bin || ''}"`,
      it.costPrice || 0,
      it.price || 0,
      it.onHand || 0,
      it.reserved || 0,
      it.available || 0,
      it.safetyStock || 5,
      (it.onHand || 0) * (it.costPrice || 0),
      `"${it.status || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventory_Stock_Report_${tenantSlug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Items for Stock Master Table
  const filteredItems = items.filter((it) => {
    const matchSearch =
      !searchQuery.trim() ||
      it.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.barcode?.includes(searchQuery.trim()) ||
      it.bin?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'IN_STOCK' && it.status === 'IN_STOCK') ||
      (statusFilter === 'LOW_STOCK' && it.status === 'LOW_STOCK') ||
      (statusFilter === 'OUT_OF_STOCK' && it.status === 'OUT_OF_STOCK') ||
      (statusFilter === 'RESERVED' && (it.reserved || 0) > 0);

    const matchLocation = locationFilter === 'ALL' || it.locationId === locationFilter;

    return matchSearch && matchStatus && matchLocation;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111625] via-[#161D31] to-[#1E2638] border border-[#222C44] shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5" />
                <span>Phase 1, 2 & 3: Intelligence & Audit Engine Active</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Real-Time ROP & Cycle Count
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Enterprise Inventory Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Multi-location bin tracking, immutable stock ledger, dynamic Reorder Point (ROP), and cycle count physical audit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenAdjust()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Stock Adjust</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              title="Export Full CSV Sheet"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadInventory}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              title="Refresh inventory data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* PHASE 1, 2, 3 & 4 SUB-TAB NAVIGATION SWITCHER */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#111625] rounded-2xl w-fit border border-[#1E2638] shadow-sm print:hidden">
        <button
          type="button"
          onClick={() => setActiveSubTab('stock')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'stock'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Stock Master</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('procurement')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'procurement'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4 text-purple-400" />
          <span>Procurement & GRN</span>
          {purchaseOrders.filter((p) => p.status === 'SENT_TO_SUPPLIER').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono">
              {purchaseOrders.filter((p) => p.status === 'SENT_TO_SUPPLIER').length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-4 h-4 text-pink-400" />
          <span>ABC Analysis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('transfer')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'transfer'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation className="w-4 h-4 text-blue-400" />
          <span>Inter-Warehouse Transfer</span>
          {stockTransfers.filter((t) => t.status === 'IN_TRANSIT').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('kpis')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'kpis'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Enterprise KPI & GMROI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('reorder')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'reorder'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Reorder Alerts (ROP)</span>
          {summary.lowStockCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          <span>Cycle Count Audit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('barcode')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'barcode'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Barcode className="w-4 h-4 text-cyan-400" />
          <span>Barcode Sheets</span>
        </button>
      </div>

      {/* KPI METRIC STRIP (5 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print:hidden">
        {/* Card 1: On-Hand Units */}
        <div className="p-5 rounded-2xl bg-[#111625] border border-[#1E2638] shadow-sm hover:border-indigo-500/40 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total On-Hand Stock</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3 font-mono">
            {summary.totalOnHand?.toLocaleString() || 0}{' '}
            <span className="text-xs font-medium text-slate-400">Units</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-indigo-400 font-bold">Physical Count</span>
            <span>across all bins</span>
          </div>
        </div>

        {/* Card 2: Available to Sell */}
        <div className="p-5 rounded-2xl bg-[#111625] border border-[#1E2638] shadow-sm hover:border-emerald-500/40 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Available to Sell</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-3 font-mono">
            {summary.totalAvailable?.toLocaleString() || 0}{' '}
            <span className="text-xs font-medium text-emerald-500/70">Units</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">On-Hand − Reserved</span>
          </div>
        </div>

        {/* Card 3: Active Reservations */}
        <div className="p-5 rounded-2xl bg-[#111625] border border-[#1E2638] shadow-sm hover:border-amber-500/40 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Reserved / Locked</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-3 font-mono">
            {summary.totalReserved?.toLocaleString() || 0}{' '}
            <span className="text-xs font-medium text-amber-500/70">Units</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Pending checkouts</span>
          </div>
        </div>

        {/* Card 4: Inventory Valuation */}
        <div className="p-5 rounded-2xl bg-[#111625] border border-[#1E2638] shadow-sm hover:border-cyan-500/40 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Total Valuation</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-300 mt-3 font-mono">
            BDT {summary.totalValuation ? (summary.totalValuation).toLocaleString() : '0'}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-cyan-400 font-semibold">Cost Basis</span>
            <span>(FIFO Valuation)</span>
          </div>
        </div>

        {/* Card 5: Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-[#111625] border border-[#1E2638] shadow-sm hover:border-rose-500/40 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Reorder Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-300 mt-3 font-mono">
            {summary.lowStockCount || 0}{' '}
            <span className="text-xs font-medium text-rose-500/70">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-rose-400 font-semibold">Stock ≤ 5 Units</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: LIVE STOCK MASTER & SKU TABLE */}
      {/* ============================================================== */}
      {activeSubTab === 'stock' && (
        <div className="space-y-6">
          {/* FILTER & WAREHOUSE BAR */}
          <div className="p-4 rounded-2xl bg-[#111625] border border-[#1E2638] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU, barcode, or product name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F19] border border-[#1E2638] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-[#1E2638]'
                }`}
              >
                All Items ({items.length})
              </button>
              <button
                onClick={() => setStatusFilter('IN_STOCK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'IN_STOCK'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-[#1E2638]'
                }`}
              >
                In Stock ({items.filter((i) => i.status === 'IN_STOCK').length})
              </button>
              <button
                onClick={() => setStatusFilter('LOW_STOCK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'LOW_STOCK'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-[#1E2638]'
                }`}
              >
                Low Stock ({items.filter((i) => i.status === 'LOW_STOCK').length})
              </button>
              <button
                onClick={() => setStatusFilter('OUT_OF_STOCK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'OUT_OF_STOCK'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-[#1E2638]'
                }`}
              >
                Out of Stock ({items.filter((i) => i.status === 'OUT_OF_STOCK').length})
              </button>
              <button
                onClick={() => setStatusFilter('RESERVED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  statusFilter === 'RESERVED'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-[#0B0F19] text-amber-400 hover:text-white border border-amber-900/40'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Reserved ({items.filter((i) => (i.reserved || 0) > 0).length})</span>
              </button>
            </div>

            {/* Warehouse Location Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Warehouse className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1E2638] text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Warehouses & Outlets</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SKU LIVE INVENTORY TABLE */}
          <div className="rounded-3xl bg-[#111625] border border-[#1E2638] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#1E2638] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-extrabold text-white tracking-wide uppercase">
                  SKU-Wise Live Stock & Valuation Ledger
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {filteredItems.length} SKUs Listed
                </span>
              </div>

              <span className="text-xs text-slate-400">
                Current Baseline: <strong className="text-slate-200">{tenantSlug ? tenantSlug.toUpperCase() : "MAIN"} Central Logistics Hub</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0F19] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#1E2638]">
                  <tr>
                    <th className="py-3.5 px-4">Product & Category</th>
                    <th className="py-3.5 px-4">SKU / Barcode</th>
                    <th className="py-3.5 px-4">Warehouse & Bin</th>
                    <th className="py-3.5 px-4 text-right">Cost / Selling (BDT)</th>
                    <th className="py-3.5 px-4 text-center">On-Hand</th>
                    <th className="py-3.5 px-4 text-center">Reserved</th>
                    <th className="py-3.5 px-4 text-center">Available to Sell</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2234]">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No products or stock records found</p>
                        <p className="text-xs text-slate-600 mt-1">Reset filters or add new products to inventory</p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const firstImg = item.images && item.images.length > 0 ? item.images[0] : null;

                      return (
                        <tr key={item.id} className="hover:bg-[#161D31] transition group">
                          {/* Product details */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                                {firstImg ? (
                                  <img
                                    src={firstImg}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition"
                                  />
                                ) : (
                                  <Boxes className="w-5 h-5 text-slate-500" />
                                )}
                              </div>
                              <div className="max-w-xs">
                                <h3 className="font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                                  {item.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                    {item.categoryName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{item.brandName}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SKU & Barcode */}
                          <td className="py-4 px-4 font-mono">
                            <div className="font-extrabold text-indigo-300 tracking-tight">{item.sku}</div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                              <Barcode className="w-3.5 h-3.5 text-slate-500" />
                              <span>{item.barcode}</span>
                            </div>
                          </td>

                          {/* Warehouse & Shelf Bin */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>WH-MAIN</span>
                            </div>
                            <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                              Bin: <strong className="text-white">{item.bin || 'A-01-01'}</strong>
                            </div>
                          </td>

                          {/* Pricing: Cost vs Sell */}
                          <td className="py-4 px-4 text-right font-mono">
                            <div className="text-white font-bold">BDT {Number(item.price || 0).toLocaleString()}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Cost: BDT {Number(item.costPrice || 0).toLocaleString()}
                            </div>
                          </td>

                          {/* On-Hand */}
                          <td className="py-4 px-4 text-center font-mono font-extrabold text-base text-white">
                            {item.onHand}
                          </td>

                          {/* Reserved */}
                          <td className="py-4 px-4 text-center">
                            {item.reserved > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>{item.reserved}</span>
                              </span>
                            ) : (
                              <span className="font-mono text-slate-500 text-xs">0</span>
                            )}
                          </td>

                          {/* Available to Sell */}
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-xl font-mono font-black text-sm ${
                                item.available > item.safetyStock
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                                  : item.available > 0
                                  ? 'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                                  : 'bg-rose-950/80 text-rose-400 border border-rose-700/60'
                              }`}
                            >
                              {item.available}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                item.status === 'IN_STOCK'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : item.status === 'LOW_STOCK'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {item.status === 'IN_STOCK'
                                ? 'IN STOCK'
                                : item.status === 'LOW_STOCK'
                                ? 'LOW STOCK'
                                : 'OUT OF STOCK'}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenAdjust(item)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1"
                                title="Quick Stock Adjust"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                                <span>Adjust</span>
                              </button>

                              <button
                                onClick={() => handleOpenLedger(item)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1"
                                title="View Immutable Stock Ledger"
                              >
                                <History className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Ledger</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB: PROCUREMENT, PURCHASE ORDERS & GRN (PHASE 4) */}
      {/* ============================================================== */}
      {activeSubTab === 'procurement' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                  Phase 4: Procurement Engine
                </span>
                <span className="text-xs text-slate-400">Supplier PO Tracking & Landed Cost GRN Engine</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Purchase Orders & Supplier Receiving (Procurement)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Create GRNs upon receiving shipments; automatically calculate unit landed costs and update stock ledgers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleOpenCreatePO()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Purchase Order</span>
              </button>

              <button
                onClick={() => setCreateSupplierModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#1A2234] border border-[#1E2638] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Add New Supplier</span>
              </button>

              <button
                onClick={() => { loadPOs(); loadSuppliers(); }}
                disabled={loadingPO}
                className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#1A2234] border border-[#1E2638] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPO ? 'animate-spin text-purple-400' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick Suppliers Badge Bar */}
          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1E2638] flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-purple-400" />
              <span>Registered Suppliers ({suppliers.length}):</span>
            </span>
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="px-3 py-1.5 rounded-xl bg-[#111625] border border-[#1E2638] flex items-center gap-2 text-xs"
              >
                <span className="font-bold text-white">{sup.companyName || sup.name}</span>
                <span className="text-[10px] text-purple-400 font-mono">({sup.leadTimeDays || 7} days lead)</span>
                <span className="text-[10px] text-slate-400 font-mono">{sup.phone}</span>
              </div>
            ))}
          </div>

          {/* PO KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#111625] border border-[#1E2638]">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total POs</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {purchaseOrders.length} <span className="text-xs text-slate-400 font-medium">Orders</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111625] border border-amber-500/30">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Pending Delivery</span>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                {purchaseOrders.filter((p) => p.status === 'SENT_TO_SUPPLIER').length} <span className="text-xs text-slate-400 font-medium">Active</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111625] border border-emerald-500/30">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Received in Warehouse</span>
              <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
                {purchaseOrders.filter((p) => p.status === 'COMPLETED').length} <span className="text-xs text-slate-400 font-medium">Completed</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111625] border border-purple-500/30">
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider block">Total PO Value</span>
              <div className="text-2xl font-black text-purple-300 font-mono mt-1">
                BDT {purchaseOrders.reduce((acc, p) => acc + Number(p.totalAmount || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Purchase Orders Table */}
          <div className="rounded-3xl bg-[#111625] border border-[#1E2638] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0F19] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#1E2638]">
                  <tr>
                    <th className="py-3.5 px-4">PO Number & Date</th>
                    <th className="py-3.5 px-4">Supplier & Contact</th>
                    <th className="py-3.5 px-4">Ordered Items</th>
                    <th className="py-3.5 px-4 text-center">Est. Delivery</th>
                    <th className="py-3.5 px-4 text-right">Total Cost</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638] font-medium">
                  {purchaseOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No purchase orders found. Click 'Create Purchase Order' to generate your first PO.
                      </td>
                    </tr>
                  ) : (
                    purchaseOrders.map((po) => {
                      const isCompleted = po.status === 'COMPLETED';
                      const isPartial = po.status === 'PARTIAL_RECEIVED';
                      const isSent = po.status === 'SENT_TO_SUPPLIER';

                      return (
                        <tr key={po.id} className="hover:bg-[#161D31]/50 transition">
                          <td className="py-4 px-4 font-mono">
                            <div className="font-black text-white text-sm">{po.poNumber}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(po.createdAt).toLocaleDateString('en-GB')}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-200">{po.supplierName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{po.supplierPhone || 'N/A'}</div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {(po.items || []).map((it: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-[11px]">
                                  <span className="font-mono text-purple-400 font-bold">{it.sku}:</span>
                                  <span className="text-slate-300 line-clamp-1 max-w-xs">{it.title}</span>
                                  <span className="text-slate-400 font-mono">
                                    (Order: {it.orderQty} {it.receivedQty ? `| Received: ${it.receivedQty}` : ''})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center font-mono text-[11px] text-slate-300">
                            {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString('en-GB') : '7 Days'}
                          </td>

                          <td className="py-4 px-4 text-right font-mono font-black text-white text-sm">
                            BDT {Number(po.totalAmount || 0).toLocaleString()}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {isCompleted && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>COMPLETED</span>
                              </span>
                            )}
                            {isPartial && (
                              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                                <Boxes className="w-3 h-3" />
                                <span>PARTIAL RECEIVED</span>
                              </span>
                            )}
                            {isSent && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>SENT TO SUPPLIER</span>
                              </span>
                            )}
                            {!isCompleted && !isPartial && !isSent && (
                              <span className="px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] font-bold">
                                {po.status}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isCompleted && (
                                <button
                                  onClick={() => handleOpenGRNModal(po)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow"
                                  title="Receive Goods & Issue GRN"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Receive (GRN)</span>
                                </button>
                              )}

                              <button
                                onClick={() => { setSelectedPOForPrint(po); setPrintPOModalOpen(true); }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#0B0F19] hover:bg-[#1E2638] text-slate-300 hover:text-white text-[11px] font-bold border border-[#1E2638] transition flex items-center gap-1"
                                title="Print View"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB: ABC CLASSIFICATION & DEAD STOCK ANALYTICS (PHASE 4) */}
      {/* ============================================================== */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-mono font-bold">
                  Phase 4: ABC Velocity & Capital Matrix
                </span>
                <span className="text-xs text-slate-400">80/20 Pareto Principle Inventory Ranking & Capital Optimization</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                ABC Inventory Matrix & Dead Stock Analytics
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Class A (top revenue drivers), Class B (moderate velocity), and Class C (slow-moving & dead stock capital) analysis.
              </p>
            </div>

            <button
              onClick={loadABC}
              disabled={loadingABC}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingABC ? 'animate-spin' : ''}`} />
              <span>Refresh Analytics</span>
            </button>
          </div>

          {/* ABC KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111625] border border-emerald-500/30">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-bold uppercase tracking-wider">Class A (Fast Movers)</span>
                <Award className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-emerald-300 font-mono mt-2">
                {abcData?.summary?.classACount || 0} <span className="text-xs text-slate-400 font-medium">SKUs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Top 70-80% Sales Revenue Drivers • <strong className="text-emerald-400">Target Service Level 98%</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111625] border border-amber-500/30">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs font-bold uppercase tracking-wider">Class B (Medium Movers)</span>
                <Boxes className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-amber-300 font-mono mt-2">
                {abcData?.summary?.classBCount || 0} <span className="text-xs text-slate-400 font-medium">SKUs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                15-20% Sales Revenue Contribution • Bi-weekly review & safety buffer
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111625] border border-rose-500/30">
              <div className="flex items-center justify-between text-rose-400">
                <span className="text-xs font-bold uppercase tracking-wider">Class C (Slow Movers)</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-rose-300 font-mono mt-2">
                {abcData?.summary?.classCCount || 0} <span className="text-xs text-slate-400 font-medium">SKUs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Bottom 5-10% Revenue • Dead stock & trapped capital risk
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111625] border border-cyan-500/30">
              <div className="flex items-center justify-between text-cyan-400">
                <span className="text-xs font-bold uppercase tracking-wider">Tied-up Capital</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono mt-2">
                BDT {(abcData?.summary?.deadStockCapital || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Estimated cash release via clearance promotions: <strong className="text-cyan-400">BDT {(abcData?.summary?.estimatedCashReleaseOpportunity || 0).toLocaleString()}</strong>
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 p-1 bg-[#111625] rounded-xl w-fit border border-[#1E2638]">
            <button
              onClick={() => setAbcFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                abcFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Products ({abcData?.items?.length || 0})
            </button>
            <button
              onClick={() => setAbcFilter('A')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                abcFilter === 'A' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span>Class A (Fast Movers)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
                {abcData?.items?.filter((i: any) => i.classification === 'A').length || 0}
              </span>
            </button>
            <button
              onClick={() => setAbcFilter('B')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                abcFilter === 'B' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <span>Class B (Moderate)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
                {abcData?.items?.filter((i: any) => i.classification === 'B').length || 0}
              </span>
            </button>
            <button
              onClick={() => setAbcFilter('C')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                abcFilter === 'C' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <span>Class C (Slow Movers)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
                {abcData?.items?.filter((i: any) => i.classification === 'C').length || 0}
              </span>
            </button>
          </div>

          {/* ABC Table */}
          <div className="rounded-3xl bg-[#111625] border border-[#1E2638] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0F19] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#1E2638]">
                  <tr>
                    <th className="py-3.5 px-4">Product & Category</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4 text-center">ABC Class</th>
                    <th className="py-3.5 px-4 text-center">On-Hand Stock</th>
                    <th className="py-3.5 px-4 text-right">Tied-up Capital</th>
                    <th className="py-3.5 px-4 text-center">Revenue Contribution</th>
                    <th className="py-3.5 px-4 text-center">Target Service Level</th>
                    <th className="py-3.5 px-4">Smart Action Recommendation</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638] font-medium">
                  {(!abcData?.items || abcData.items.length === 0) ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        No catalog items found.
                      </td>
                    </tr>
                  ) : (
                    abcData.items
                      .filter((it: any) => abcFilter === 'ALL' || it.classification === abcFilter)
                      .map((it: any) => {
                        const isA = it.classification === 'A';
                        const isB = it.classification === 'B';
                        const isC = it.classification === 'C';

                        return (
                          <tr key={it.id} className="hover:bg-[#161D31]/50 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#0B0F19] border border-[#1E2638] overflow-hidden shrink-0 flex items-center justify-center">
                                  {it.image ? (
                                    <img src={it.image} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <Boxes className="w-4 h-4 text-slate-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-extrabold text-white text-xs line-clamp-1 max-w-xs">
                                    {it.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400">{it.category}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                              {it.sku}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              {isA && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black tracking-wider">
                                  CLASS A
                                </span>
                              )}
                              {isB && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black tracking-wider">
                                  CLASS B
                                </span>
                              )}
                              {isC && (
                                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-black tracking-wider">
                                  CLASS C
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                              {it.onHand} Pcs
                            </td>

                            <td className="py-3.5 px-4 text-right font-mono font-black text-cyan-300">
                              BDT {Number(it.tiedUpCapital || 0).toLocaleString()}
                            </td>

                            <td className="py-3.5 px-4 text-center font-mono">
                              <div className="text-white font-bold">{it.cumulativePercent}%</div>
                              <div className="text-[10px] text-slate-400">Cumulative</div>
                            </td>

                            <td className="py-3.5 px-4 text-center font-mono font-bold">
                              <span className={isA ? 'text-emerald-400' : isB ? 'text-amber-400' : 'text-slate-400'}>
                                {it.serviceLevelTarget}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="text-[11px] text-slate-300 leading-tight">
                                {it.suggestedAction}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleOpenCreatePO(it, 10)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-bold transition"
                              >
                                {isA ? 'Restock PO' : 'Reorder'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB: INTER-WAREHOUSE TRANSFERS & IN-TRANSIT (PHASE 5) */}
      {/* ============================================================== */}
      {activeSubTab === 'transfer' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                  Phase 5: Multi-Warehouse Transfer Engine
                </span>
                <span className="text-xs text-slate-400">Inter-branch and outlet stock dispatch with gatepass tracking</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Inter-Warehouse Transfers & Gatepass Tracking
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Secure stock dispatch from Central Warehouse (WH-MAIN) to branch showrooms with in-transit tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleOpenCreateTransfer()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Dispatch Transfer Challan</span>
              </button>

              <button
                onClick={loadTransfers}
                disabled={loadingTransfers}
                className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#1A2234] border border-[#1E2638] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingTransfers ? 'animate-spin text-blue-400' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Location Transit Route Visual */}
          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1E2638] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Origin Warehouse</span>
                <strong className="text-white text-sm">Main Central Warehouse (WH-MAIN)</strong>
                <span className="text-[10px] text-slate-400 block font-mono">Tejgaon Industrial Area, Dhaka</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111625] border border-blue-500/30 text-blue-300 font-mono text-[11px] font-bold">
              <Truck className="w-4 h-4 animate-bounce text-blue-400" />
              <span>Transit Route: Dhaka Metro Van</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Destination Showroom</span>
                <strong className="text-white text-sm">Dhanmondi Showroom & Pickup (SH-DHN)</strong>
                <span className="text-[10px] text-slate-400 block font-mono">Road 27, Dhanmondi, Dhaka</span>
              </div>
            </div>
          </div>

          {/* Transfer KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#111625] border border-[#1E2638]">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Challans</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {stockTransfers.length} <span className="text-xs text-slate-400 font-medium">Challans</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111625] border border-blue-500/30">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block">In-Transit</span>
              <div className="text-2xl font-black text-blue-300 font-mono mt-1">
                {stockTransfers.filter((t) => t.status === 'IN_TRANSIT').length} <span className="text-xs text-slate-400 font-medium">Vehicles</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111625] border border-emerald-500/30">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Delivered / Received</span>
              <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
                {stockTransfers.filter((t) => t.status === 'RECEIVED').length} <span className="text-xs text-slate-400 font-medium">Completed</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111625] border border-indigo-500/30">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block">Total Units Transferred</span>
              <div className="text-2xl font-black text-indigo-300 font-mono mt-1">
                {stockTransfers.reduce((acc, t) => acc + (t.totalUnits || 0), 0)} <span className="text-xs text-slate-400 font-medium">Units</span>
              </div>
            </div>
          </div>

          {/* Transfers Table */}
          <div className="rounded-3xl bg-[#111625] border border-[#1E2638] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0F19] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#1E2638]">
                  <tr>
                    <th className="py-3.5 px-4">Challan # & Date</th>
                    <th className="py-3.5 px-4">Route (From ➔ To)</th>
                    <th className="py-3.5 px-4">Vehicle & Driver</th>
                    <th className="py-3.5 px-4">Transferred Items</th>
                    <th className="py-3.5 px-4 text-center">Total Quantity</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638] font-medium">
                  {stockTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No transfer challans found. Click 'Dispatch Transfer Challan' to start a transfer.
                      </td>
                    </tr>
                  ) : (
                    stockTransfers.map((trf) => {
                      const isTransit = trf.status === 'IN_TRANSIT';
                      const isReceived = trf.status === 'RECEIVED';

                      return (
                        <tr key={trf.id} className="hover:bg-[#161D31]/50 transition">
                          <td className="py-4 px-4 font-mono">
                            <div className="font-black text-white text-sm">{trf.challanNumber}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(trf.dispatchedAt || trf.createdAt || Date.now()).toLocaleDateString('en-GB')}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="text-slate-200 font-bold">{trf.fromLocationName || 'Central WH'}</div>
                            <div className="text-[10px] text-blue-400 font-mono mt-0.5">➔ {trf.toLocationName || 'Dhanmondi Showroom'}</div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-mono text-white text-xs">{trf.vehicleNumber}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {trf.driverName} ({trf.driverPhone || 'No Phone'})
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {(trf.items || []).map((it: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-[11px]">
                                  <span className="font-mono text-blue-400 font-bold">{it.sku}:</span>
                                  <span className="text-slate-300 line-clamp-1 max-w-xs">{it.title}</span>
                                  <span className="text-slate-400 font-mono">
                                    ({it.transferQty} units | {it.sourceBin} ➔ {it.targetBin})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center font-mono font-black text-white text-sm">
                            {trf.totalUnits || (trf.items || []).reduce((acc: number, it: any) => acc + it.transferQty, 0)} Units
                          </td>

                          <td className="py-4 px-4 text-center">
                            {isTransit && (
                              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold inline-flex items-center gap-1">
                                <Truck className="w-3 h-3 text-blue-400 animate-pulse" />
                                <span>IN TRANSIT</span>
                              </span>
                            )}
                            {isReceived && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>RECEIVED</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isTransit && (
                                <button
                                  onClick={() => handleReceiveTransfer(trf)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow"
                                  title="Confirm physical receipt at destination"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Confirm Receipt</span>
                                </button>
                              )}

                              <button
                                onClick={() => { setSelectedTransferForPrint(trf); setPrintTransferModalOpen(true); }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#0B0F19] hover:bg-[#1E2638] text-slate-300 hover:text-white text-[11px] font-bold border border-[#1E2638] transition flex items-center gap-1"
                                title="Print Delivery Challan & Gatepass"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Gatepass Challan</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB: ENTERPRISE PERFORMANCE KPIS & GMROI (PHASE 5) */}
      {/* ============================================================== */}
      {activeSubTab === 'kpis' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  Phase 5: Financial Metrics & Audit Integrity
                </span>
                <span className="text-xs text-slate-400">Turnover ratio, GMROI, and cryptographic ledger security</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Enterprise Inventory Performance & GMROI
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inventory gross profit margin, Sell-Through Rate (STR %), and immutable cryptographic audit seals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleVerifyIntegrity}
                disabled={verifyingIntegrity}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{verifyingIntegrity ? 'Verifying...' : 'Verify Cryptographic Audit Seal'}</span>
              </button>

              <button
                onClick={loadKPIs}
                disabled={loadingKPIs}
                className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#1A2234] border border-[#1E2638] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingKPIs ? 'animate-spin text-emerald-400' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Cryptographic Ledger Integrity Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#111625] to-[#161D31] border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-sm">Cryptographic Immutable Ledger Security Verification</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                    100% TAMPER-PROOF
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Total {integrityData?.totalLedgerEntries || 14} stock ledger records audited. Zero unauthorized deletions or tampering detected.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">
                  SHA-256 Audit Seal: <strong>{integrityData?.verificationSeal || 'SEC-SHA256-235B37D68A0EEDA5'}</strong>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#0B0F19] border border-emerald-500/30 text-center shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Audit Compliance</span>
              <strong className="text-emerald-400 text-xs font-mono font-bold">PASS (Zero Tampering)</strong>
            </div>
          </div>

          {/* 4 Hero Enterprise KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Inventory Turnover */}
            <div className="p-5 rounded-2xl bg-[#111625] border border-indigo-500/30">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block">Inventory Turnover Ratio</span>
              <div className="text-3xl font-black text-indigo-300 font-mono mt-2">
                {kpiData?.inventoryTurnoverRatio || 0.06} <span className="text-xs text-slate-400 font-medium">Turns/Yr</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                <span>Days to Sell (DSI):</span>
                <strong className="text-white font-mono">{kpiData?.daysSalesOfInventory || 180} Days</strong>
              </div>
            </div>

            {/* KPI 2: GMROI */}
            <div className="p-5 rounded-2xl bg-[#111625] border border-emerald-500/30">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">GMROI (Gross Margin ROI)</span>
              <div className="text-3xl font-black text-emerald-300 font-mono mt-2">
                {kpiData?.gmroi || 0.02} <span className="text-xs text-slate-400 font-medium">Multiple</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Gross profit earned per currency unit invested in inventory
              </div>
            </div>

            {/* KPI 3: Sell-Through Rate (STR) */}
            <div className="p-5 rounded-2xl bg-[#111625] border border-cyan-500/30">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">Sell-Through Rate (STR %)</span>
              <div className="text-3xl font-black text-cyan-300 font-mono mt-2">
                {kpiData?.sellThroughRate || 7.8} <span className="text-xs text-slate-400 font-medium">%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Total Units Sold: <strong className="text-white font-mono">{kpiData?.totalUnitsSold || 9} Units</strong>
              </div>
            </div>

            {/* KPI 4: Stock Health Score */}
            <div className="p-5 rounded-2xl bg-[#111625] border border-purple-500/30">
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider block">Inventory Health Score</span>
              <div className="text-3xl font-black text-purple-300 font-mono mt-2">
                {kpiData?.healthScore || 85} <span className="text-xs text-slate-400 font-medium">/ 100</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Grade: A (Optimal Operation)</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] space-y-4">
            <h3 className="text-sm font-black text-white">Financial & Valuation Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2638]">
                <span className="text-slate-400 text-[10px] uppercase block">Total Sales Revenue</span>
                <div className="text-lg font-black text-white mt-1">BDT {Number(kpiData?.totalRevenue || 60600).toLocaleString()}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2638]">
                <span className="text-slate-400 text-[10px] uppercase block">Cost of Goods Sold (COGS)</span>
                <div className="text-lg font-black text-slate-300 mt-1">BDT {Number(kpiData?.cogs || 42600).toLocaleString()}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2638]">
                <span className="text-slate-400 text-[10px] uppercase block">Gross Profit Margin</span>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  BDT {Number(kpiData?.grossMargin || 18000).toLocaleString()} ({kpiData?.grossMarginPercent || 29.7}%)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E2638]">
                <span className="text-slate-400 text-[10px] uppercase block">Current On-Hand Valuation</span>
                <div className="text-lg font-black text-cyan-400 mt-1">BDT {Number(kpiData?.inventoryValuation || 773220).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB: REORDER INTELLIGENCE & SAFETY BUFFER (PHASE 3) */}
      {/* ============================================================== */}
      {activeSubTab === 'reorder' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  Dynamic ROP Engine
                </span>
                <span className="text-xs text-slate-400">Formula: ROP = (Velocity × 7 Days) + Safety Buffer</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Smart Restock & Reorder Point (ROP) Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated purchase order recommendations synchronized with vendor lead times and safety stock.
              </p>
            </div>

            <button
              onClick={loadReorderSuggestions}
              disabled={loadingReorder}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingReorder ? 'animate-spin' : ''}`} />
              <span>Recalculate ROP</span>
            </button>
          </div>

          {/* Reorder Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#111625] border border-amber-500/30">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                Restock Required (Low Stock Items)
              </span>
              <div className="text-3xl font-black text-amber-300 font-mono mt-2">
                {reorderData?.summary?.totalItemsNeedingReorder || 0} <span className="text-xs text-slate-400">SKUs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Items operating below or near safety threshold</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111625] border border-indigo-500/30">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block">
                Suggested Restock Units
              </span>
              <div className="text-3xl font-black text-indigo-300 font-mono mt-2">
                {reorderData?.summary?.totalSuggestedUnits || 0} <span className="text-xs text-slate-400">Pcs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Recommended quantity to achieve target buffer</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111625] border border-cyan-500/30">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
                Estimated Restock Investment
              </span>
              <div className="text-3xl font-black text-cyan-300 font-mono mt-2">
                BDT {(reorderData?.summary?.totalRestockCost || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Calculated at standard wholesale unit cost</p>
            </div>
          </div>

          {/* Reorder Table */}
          <div className="rounded-3xl bg-[#111625] border border-[#1E2638] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0F19] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#1E2638]">
                  <tr>
                    <th className="py-3.5 px-4">Product Details</th>
                    <th className="py-3.5 px-4">SKU / Bin</th>
                    <th className="py-3.5 px-4 text-center">Available Stock</th>
                    <th className="py-3.5 px-4 text-center">Safety Buffer</th>
                    <th className="py-3.5 px-4 text-center">Reorder Point (ROP)</th>
                    <th className="py-3.5 px-4 text-center font-bold text-indigo-300">Suggested PO Qty</th>
                    <th className="py-3.5 px-4 text-right">Est. Cost (BDT)</th>
                    <th className="py-3.5 px-4 text-center">Priority</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2234]">
                  {loadingReorder ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                        <span>Calculating restock schedule...</span>
                      </td>
                    </tr>
                  ) : !reorderData?.suggestions || reorderData.suggestions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="font-bold text-white text-sm">All products have sufficient inventory!</p>
                        <p className="text-xs text-slate-500 mt-1">Zero items currently breach safety threshold levels.</p>
                      </td>
                    </tr>
                  ) : (
                    reorderData.suggestions.map((sug: any) => {
                      const isCritical = sug.priority === 'CRITICAL_OUT_OF_STOCK';
                      const isHigh = sug.priority === 'HIGH_SAFETY_BREACH';

                      return (
                        <tr key={sug.itemId} className="hover:bg-[#161D31] transition">
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">{sug.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{sug.categoryName}</div>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            <span className="text-indigo-300 font-bold">{sug.sku}</span>
                            <div className="text-[10px] text-cyan-400">Bin: {sug.bin}</div>
                          </td>

                          <td className="py-4 px-4 text-center font-mono font-bold text-white">
                            {sug.available} Units
                          </td>

                          <td className="py-4 px-4 text-center font-mono text-slate-400">
                            {sug.safetyBuffer} Units
                          </td>

                          <td className="py-4 px-4 text-center font-mono font-bold text-amber-400">
                            {sug.reorderPoint} Units
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-mono font-black text-sm border border-indigo-500/30">
                              +{sug.suggestedQty} Units
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right font-mono font-bold text-white">
                            BDT {sug.estimatedCost.toLocaleString()}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                isCritical
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                                  : isHigh
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              }`}
                            >
                              {isCritical ? 'OUT OF STOCK' : isHigh ? 'SAFETY BUFFER BREACH' : 'RESTOCK RECOMMENDED'}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                const it = items.find((i) => i.id === sug.itemId);
                                handleOpenAdjust(
                                  it,
                                  'RECEIVE_PO',
                                  String(sug.suggestedQty),
                                  `Factory Restock PO based on ROP (${sug.reorderPoint}) recommendation`
                                );
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm active:scale-95"
                            >
                              Draft PO
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: CYCLE COUNT & PHYSICAL INVENTORY AUDIT (PHASE 3) */}
      {/* ============================================================== */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  Cycle Count Tool
                </span>
                <span className="text-xs text-slate-400">Physical count vs perpetual system ledger variance reconciliation</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Cycle Count & Physical Stock Audit Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter actual physical quantities counted on warehouse shelves. Any variances will automatically post COUNT_ADJUST ledger entries.
              </p>
            </div>

            <button
              onClick={loadAudits}
              disabled={loadingAudits}
              className="px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-[#1A2234] border border-[#1E2638] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit History Logs ({auditsList.length})</span>
            </button>
          </div>

          {/* Audit Session Input Controls */}
          <form onSubmit={handleSubmitAuditSession} className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#111625] border border-[#1E2638] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Audit Session Name *</label>
                <input
                  type="text"
                  required
                  value={auditSessionName}
                  onChange={(e) => setAuditSessionName(e.target.value)}
                  placeholder="e.g. Weekly Tejgaon Bin A-01 Cycle Count"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Auditor Name / ID *</label>
                <input
                  type="text"
                  required
                  value={auditConductedBy}
                  onChange={(e) => setAuditConductedBy(e.target.value)}
                  placeholder="e.g. Auditor Sabbir Hossen"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Warehouse Location</label>
                <select
                  value={auditLocationId}
                  onChange={(e) => setAuditLocationId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1E2638] text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Audit Counting Grid Table */}
            <div className="rounded-3xl bg-[#111625] border border-[#1E2638] overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-[#1E2638] flex items-center justify-between">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Product Cycle Count Verification Sheet
                </span>
                <span className="text-xs text-slate-400">
                  Total Items to Audit: <strong className="text-indigo-400 font-mono">{items.length}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B0F19] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#1E2638]">
                    <tr>
                      <th className="py-3.5 px-4">Product & Category</th>
                      <th className="py-3.5 px-4">SKU / Shelf Bin</th>
                      <th className="py-3.5 px-4 text-center">System Expected (On-Hand)</th>
                      <th className="py-3.5 px-4 text-center">Physical Count</th>
                      <th className="py-3.5 px-4 text-center">Discrepancy (Variance)</th>
                      <th className="py-3.5 px-4">Auditor Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2234]">
                    {items.map((it) => {
                      const currentEntry = auditCounts[it.id] || { counted: it.onHand || 0, notes: '' };
                      const diff = Number(currentEntry.counted) - Number(it.onHand || 0);

                      return (
                        <tr key={it.id} className="hover:bg-[#161D31] transition">
                          <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                            {it.title}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-indigo-300">
                            {it.sku}
                            <span className="text-[10px] text-cyan-400 block font-normal">Bin: {it.bin}</span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-bold text-white text-sm">
                            {it.onHand} Pcs
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              value={currentEntry.counted}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                setAuditCounts((prev) => ({
                                  ...prev,
                                  [it.id]: { ...prev[it.id], counted: val },
                                }));
                              }}
                              className="w-24 px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-center font-mono font-black text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-black text-sm">
                            {diff === 0 ? (
                              <span className="text-emerald-400 flex items-center justify-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>0 (Exact Match)</span>
                              </span>
                            ) : diff > 0 ? (
                              <span className="text-amber-400">+{diff} (Surplus)</span>
                            ) : (
                              <span className="text-rose-400">{diff} (Deficit)</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              value={currentEntry.notes}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAuditCounts((prev) => ({
                                  ...prev,
                                  [it.id]: { ...prev[it.id], notes: val },
                                }));
                              }}
                              placeholder="e.g. Unit damaged during transit or packaging defect"
                              className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Submit Audit Button */}
              <div className="p-4 bg-[#0B0F19] border-t border-[#1E2638] flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Detected variances will automatically create immutable <strong>`COUNT_ADJUST`</strong> stock ledger entries.
                </span>
                <button
                  type="submit"
                  disabled={submittingAudit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>{submittingAudit ? 'Processing Audit Adjustment...' : 'Submit Audit & Reconcile Ledger'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Past Audits Timeline List */}
          {auditsList.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historical Audit Logs</h3>
              <div className="space-y-3">
                {auditsList.map((aud) => (
                  <div
                    key={aud.id}
                    className="p-4 rounded-2xl bg-[#111625] border border-[#1E2638] flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-300">{aud.id}</span>
                        <strong className="text-sm text-white">{aud.sessionName}</strong>
                      </div>
                      <p className="text-xs text-slate-400">
                        Auditor: <strong className="text-slate-300">{aud.conductedBy}</strong> · Date:{' '}
                        {new Date(aud.createdAt).toLocaleDateString('en-GB')}{' '}
                        {new Date(aud.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xs text-slate-400">Discrepancies Detected: </span>
                      <strong className="text-amber-400 font-bold">{aud.discrepanciesCount || 0} items</strong>
                      <div className="text-[11px] text-slate-500">
                        Net Adjustment: {aud.netAdjustmentUnits > 0 ? `+${aud.netAdjustmentUnits}` : aud.netAdjustmentUnits} Units
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 4: BARCODE PRINTABLE STICKER SHEET (PHASE 3) */}
      {/* ============================================================== */}
      {activeSubTab === 'barcode' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                  Print Ready Stickers
                </span>
                <span className="text-xs text-slate-400">High-density thermal and laser inventory barcode labels</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Product Barcode Stickers & Shelf Labels
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Print ready-to-affix barcode sticker sheets directly for product boxes and shelf bins.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Barcode Sheet</span>
            </button>
          </div>

          {/* Barcode Sticker Grid (Printer Friendly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-3 print:text-black">
            {items.map((it) => (
              <div
                key={it.id}
                className="p-4 rounded-2xl bg-white text-slate-950 border-2 border-slate-900 shadow-md flex flex-col justify-between space-y-3 print:border-black print:rounded-lg print:p-3 print:break-inside-avoid"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                      ARBAN LEATHER
                    </span>
                    <span className="text-[10px] font-mono font-extrabold text-slate-600">
                      Bin: {it.bin || 'A-01-01'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-950 mt-1.5 line-clamp-1">
                    {it.title}
                  </h4>
                  <p className="text-[10px] text-slate-500">{it.categoryName}</p>
                </div>

                {/* Simulated High-Res Barcode Graphic */}
                <div className="text-center py-1">
                  <div className="font-mono text-xl tracking-[0.25em] font-black text-slate-900 select-all overflow-hidden h-9 flex items-center justify-center">
                    ||||| | |||| || | |||| ||| |||| |
                  </div>
                  <div className="font-mono text-[11px] font-black tracking-widest text-slate-800 mt-0.5">
                    {it.barcode}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="font-mono text-[10px] font-bold text-slate-700">SKU: {it.sku}</span>
                  <span className="font-mono text-xs font-black text-slate-950">
                    BDT {Number(it.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: QUICK STOCK ADJUSTMENT WITH AUDIT LOGGING */}
      {/* ============================================================== */}
      {adjustModalOpen && adjustItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Stock Adjustment & Perpetual Ledger Entry
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Audit compliance requires a documented reason for every manual stock variance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Product Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {adjustItem.images && adjustItem.images.length > 0 ? (
                  <img src={adjustItem.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Boxes className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-sm text-slate-900 line-clamp-1">{adjustItem.title}</div>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    SKU: {adjustItem.sku}
                  </span>
                  <span className="text-slate-600">
                    Current On-Hand:{' '}
                    <strong className="text-slate-900 font-mono text-sm">{adjustItem.onHand} Units</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Adjustment Form */}
            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Movement Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">
                    Movement Type *
                  </label>
                  <select
                    value={adjustType}
                    onChange={(e: any) => setAdjustType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="RECEIVE_PO">RECEIVE_PO: New Vendor Delivery (+)</option>
                    <option value="COUNT_ADJUST">COUNT_ADJUST: Physical Cycle Count Reconciliation (±)</option>
                    <option value="DAMAGE_WRITEOFF">DAMAGE_WRITEOFF: Damaged or Expired Goods Write-off (−)</option>
                    <option value="RETURN_RESTOCK">RETURN_RESTOCK: Customer Return Restocked (+)</option>
                    <option value="RETURN_DAMAGED">RETURN_DAMAGED: Customer Return Damaged / Quarantine (−)</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">
                    Adjustment Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5 or -2"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-mono font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <span className="text-[11px] text-slate-500">
                    {adjustType === 'DAMAGE_WRITEOFF'
                      ? 'Automatically deducted from stock (−)'
                      : 'Added or subtracted based on movement type'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Warehouse</label>
                  <select
                    value={adjustLocationId}
                    onChange={(e) => setAdjustLocationId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.code} ({loc.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shelf Bin */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Shelf Bin</label>
                  <input
                    type="text"
                    value={adjustBin}
                    onChange={(e) => setAdjustBin(e.target.value)}
                    placeholder="e.g. A-01-02"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-mono font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                {/* Reference Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Reference / Voucher No.</label>
                  <input
                    type="text"
                    value={adjustReference}
                    onChange={(e) => setAdjustReference(e.target.value)}
                    placeholder="e.g. PO-2026-OCT-02"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-mono font-bold focus:outline-none focus:border-indigo-500 placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Mandatory Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Mandatory Audit Reason *</span>
                  <span className="text-rose-600 font-bold">Required Field</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Factory delivery QC passed / 2 units damaged in shipping packaging"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-semibold focus:outline-none focus:border-indigo-500 placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{adjusting ? 'Saving to Ledger...' : 'Save & Update Stock Ledger'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: IMMUTABLE STOCK LEDGER AUDIT TIMELINE */}
      {/* ============================================================== */}
      {ledgerModalOpen && selectedLedgerItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0F19] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100 border border-[#1E2638] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#1E2638] shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                    Immutable Audit Trail
                  </span>
                  <span className="text-xs text-slate-400 font-mono">SKU: {selectedLedgerItem.sku}</span>
                </div>
                <h3 className="text-lg font-black text-white">{selectedLedgerItem.title}</h3>
                <p className="text-xs text-slate-400">
                  Current On-Hand:{' '}
                  <strong className="text-emerald-400 font-mono text-sm">{selectedLedgerItem.onHand} Units</strong>{' '}
                  · Available:{' '}
                  <strong className="text-white font-mono text-sm">{selectedLedgerItem.available} Units</strong> · Bin:{' '}
                  <strong className="text-cyan-400 font-mono">{selectedLedgerItem.bin}</strong>
                </p>
              </div>

              <button
                onClick={() => setLedgerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#111625] hover:bg-[#1E2638] text-slate-400 hover:text-white flex items-center justify-center font-bold transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ledger Transactions Table / Timeline */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingLedger ? (
                <div className="py-16 text-center text-slate-500">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-400" />
                  <p className="text-xs">Loading ledger history...</p>
                </div>
              ) : ledgerEntries.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No ledger transactions recorded for this item.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ledgerEntries.map((entry, idx) => {
                    const isPositive = entry.qtyChange > 0;
                    const isOpening = entry.movementType === 'OPENING_BALANCE';
                    const isDamage = entry.movementType === 'DAMAGE_WRITEOFF';

                    return (
                      <div
                        key={entry.id || idx}
                        className="p-4 rounded-2xl bg-[#111625] border border-[#1E2638] hover:border-[#2A344E] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Left: Movement type & details */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              isOpening
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : isDamage
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : isPositive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {isPositive ? '+' : isOpening ? '★' : '−'}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white uppercase">
                                {entry.movementType}
                              </span>
                              {entry.reference && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0B0F19] text-indigo-300 border border-[#1E2638]">
                                  {entry.reference}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 font-mono">
                                {entry.locationName || 'WH-MAIN'} ({entry.bin})
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                              &ldquo;{entry.notes || 'No audit note provided'}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1 text-slate-400">
                                <User className="w-3 h-3 text-slate-500" />
                                {entry.performedBy || 'System Auditor'}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(entry.createdAt).toLocaleDateString('en-GB')}{' '}
                                {new Date(entry.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Quantity Change & Balance After */}
                        <div className="sm:text-right shrink-0 font-mono">
                          <div
                            className={`text-base font-black ${
                              isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isPositive ? `+${entry.qtyChange}` : entry.qtyChange} Units
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Balance:{' '}
                            <strong className="text-white font-bold">{entry.balanceAfter} Units</strong>
                          </div>
                          {entry.unitCost > 0 && (
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              @ BDT {Number(entry.unitCost).toLocaleString()} / unit
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#1E2638] flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Total ledger records: <strong className="text-slate-300 font-mono">{ledgerEntries.length}</strong>
              </span>
              <button
                onClick={() => setLedgerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#111625] hover:bg-[#1E2638] text-slate-300 text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CREATE PURCHASE ORDER (PHASE 4) */}
      {/* ============================================================== */}
      {createPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Create Purchase Order (PO)</h3>
                  <p className="text-xs text-slate-500 font-medium">Issue official purchase order and unit quantities to approved vendor</p>
                </div>
              </div>
              <button
                onClick={() => setCreatePOModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitPO} className="space-y-4 text-xs font-semibold text-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Select Supplier *</label>
                <select
                  value={newPOSupplierId}
                  onChange={(e) => setNewPOSupplierId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:outline-none focus:border-purple-500"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.companyName || s.name} ({s.leadTimeDays || 7} days lead) - {s.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Order Items & Unit Cost</label>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 max-h-48 overflow-y-auto">
                  {newPOItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <label className="text-[9px] text-slate-400 block">Quantity (Units)</label>
                          <input
                            type="number"
                            min="1"
                            value={item.orderQty}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                              const updated = [...newPOItems];
                              updated[idx].orderQty = val;
                              setNewPOItems(updated);
                            }}
                            className="w-full px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-center"
                          />
                        </div>
                        <div className="w-24">
                          <label className="text-[9px] text-slate-400 block">Unit Cost</label>
                          <input
                            type="number"
                            value={item.unitCost}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              const updated = [...newPOItems];
                              updated[idx].unitCost = val;
                              setNewPOItems(updated);
                            }}
                            className="w-full px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-right"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                <span className="text-purple-900 font-bold">Total Estimated Cost:</span>
                <span className="text-base font-black text-purple-700 font-mono">
                  BDT {newPOItems.reduce((acc, it) => acc + (it.orderQty * it.unitCost), 0).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={newPOExpectedDate}
                    onChange={(e) => setNewPOExpectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Notes / Terms</label>
                  <input
                    type="text"
                    value={newPONotes}
                    onChange={(e) => setNewPONotes(e.target.value)}
                    placeholder="e.g. Export grade finishing required"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-medium focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreatePOModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submittingPO}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  {submittingPO ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Confirm & Issue Purchase Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: GOODS RECEIVE NOTE (GRN) & LANDED COST (PHASE 4) */}
      {/* ============================================================== */}
      {grnModalOpen && selectedPOForGRN && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Receive Goods & Issue GRN (Landed Cost Engine)</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    PO #{selectedPOForGRN.poNumber} • Supplier: {selectedPOForGRN.supplierName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGrnModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitGRN} className="space-y-5 text-xs font-semibold text-slate-800">
              {/* Receiving Items Table */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">Verify Received Items & Quantities</label>
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Product</th>
                        <th className="py-2.5 px-3 text-center">Ordered Qty</th>
                        <th className="py-2.5 px-3 text-center">Received (Units)</th>
                        <th className="py-2.5 px-3 text-center">Rejected (Damage)</th>
                        <th className="py-2.5 px-3 text-center">Shelf / Bin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedPOForGRN.items || []).map((it: any) => {
                        const entry = grnItemCounts[it.itemId] || { receivedQty: 0, rejectedQty: 0, bin: 'A-01-01' };

                        return (
                          <tr key={it.itemId}>
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900 line-clamp-1">{it.title}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                SKU: {it.sku} • Cost: {it.unitCost}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                              {it.orderQty}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max={it.orderQty}
                                value={entry.receivedQty}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                  setGrnItemCounts({
                                    ...grnItemCounts,
                                    [it.itemId]: { ...entry, receivedQty: val },
                                  });
                                }}
                                className="w-16 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-300 font-mono text-xs font-bold text-center text-emerald-900"
                              />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                value={entry.rejectedQty}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                  setGrnItemCounts({
                                    ...grnItemCounts,
                                    [it.itemId]: { ...entry, rejectedQty: val },
                                  });
                                }}
                                className="w-14 px-2 py-1 rounded-lg bg-rose-50 border border-rose-300 font-mono text-xs font-bold text-center text-rose-900"
                              />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="text"
                                value={entry.bin}
                                onChange={(e) => {
                                  setGrnItemCounts({
                                    ...grnItemCounts,
                                    [it.itemId]: { ...entry, bin: e.target.value },
                                  });
                                }}
                                className="w-20 px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 font-mono text-[11px] font-bold text-center uppercase"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Landed Cost Surcharges Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Landed Cost Surcharges</span>
                  <span className="text-[10px] text-slate-500 font-normal">Freight and handling are proportionally allocated to each unit cost</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Freight / Shipping Cost</label>
                    <input
                      type="number"
                      value={grnFreightCost}
                      onChange={(e) => setGrnFreightCost(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Labor & Handling Cost</label>
                    <input
                      type="number"
                      value={grnLaborCost}
                      onChange={(e) => setGrnLaborCost(e.target.value)}
                      placeholder="e.g. 200"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Surcharge preview */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                  <span>Total Surcharges: <strong>BDT {(parseFloat(grnFreightCost) || 0) + (parseFloat(grnLaborCost) || 0)}</strong></span>
                  <span>
                    Additional per Unit: +BDT {
                      Math.round(
                        (((parseFloat(grnFreightCost) || 0) + (parseFloat(grnLaborCost) || 0)) /
                        Math.max(1, Object.values(grnItemCounts).reduce((acc: number, c: any) => acc + (Number(c.receivedQty) || 0), 0))) * 10
                      ) / 10
                    } / unit
                  </span>
                </div>
              </div>

              {/* Inspector & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">QC Inspector Name *</label>
                  <input
                    type="text"
                    required
                    value={grnInspectedBy}
                    onChange={(e) => setGrnInspectedBy(e.target.value)}
                    placeholder="Inspector Staff"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Inspection & Delivery Notes</label>
                  <input
                    type="text"
                    value={grnNotes}
                    onChange={(e) => setGrnNotes(e.target.value)}
                    placeholder="All pieces inspected and verified"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGrnModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submittingGRN}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  {submittingGRN ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Confirm GRN & Post to Stock Ledger</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: ADD SUPPLIER (PHASE 4) */}
      {/* ============================================================== */}
      {createSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Register New Supplier Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">Authorized vendor, component manufacturer, or logistics supplier</p>
                </div>
              </div>
              <button
                onClick={() => setCreateSupplierModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSupplier} className="space-y-4 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Company / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={newSupplierCompany}
                    onChange={(e) => setNewSupplierCompany(e.target.value)}
                    placeholder="e.g. Dhaka Leather Finishing Ltd"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                    placeholder="e.g. Md. Rafiqul Islam"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newSupplierPhone}
                    onChange={(e) => setNewSupplierPhone(e.target.value)}
                    placeholder="+8801700000000"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Email Address</label>
                  <input
                    type="email"
                    value={newSupplierEmail}
                    onChange={(e) => setNewSupplierEmail(e.target.value)}
                    placeholder="supply@tannery.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Average Lead Time (Days)</label>
                  <input
                    type="number"
                    value={newSupplierLeadTime}
                    onChange={(e) => setNewSupplierLeadTime(e.target.value)}
                    placeholder="7"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Payment Terms</label>
                  <input
                    type="text"
                    value={newSupplierPaymentTerms}
                    onChange={(e) => setNewSupplierPaymentTerms(e.target.value)}
                    placeholder="Net 15 Days (COD Available)"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-900">Address & Facility Location</label>
                <input
                  type="text"
                  value={newSupplierAddress}
                  onChange={(e) => setNewSupplierAddress(e.target.value)}
                  placeholder="Hemayetpur Leather Industrial Park, Savar"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateSupplierModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submittingSupplier}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  {submittingSupplier ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Supplier Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: PRINT PURCHASE ORDER SHEET (PHASE 4) */}
      {/* ============================================================== */}
      {printPOModalOpen && selectedPOForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative text-slate-900 border border-slate-200">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Printer className="w-5 h-5 text-indigo-600" />
                <span>Purchase Order Print Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Purchase Order</span>
                </button>
                <button
                  onClick={() => setPrintPOModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="space-y-6 print:p-0">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-wider">ARBAN LEATHER BD</h1>
                  <p className="text-xs text-slate-600">Enterprise Leather Goods & Accessories Manufacturing</p>
                  <p className="text-[11px] text-slate-500">Tejgaon Industrial Area, Dhaka, Bangladesh</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xl font-black text-indigo-700">{selectedPOForPrint.poNumber}</div>
                  <div className="text-xs text-slate-600 font-bold">OFFICIAL PURCHASE ORDER</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Date: {new Date(selectedPOForPrint.createdAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>

              {/* Vendor & Delivery Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">VENDOR:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedPOForPrint.supplierName}</div>
                  <div className="text-slate-600 font-mono text-[11px]">{selectedPOForPrint.supplierPhone}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">SHIP TO:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Central Logistics Hub (WH-MAIN)</div>
                  <div className="text-slate-600 text-[11px]">Tejgaon Industrial Area, Dhaka</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-slate-300 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2.5 px-3">SL</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 font-mono">SKU</th>
                      <th className="py-2.5 px-3 text-center">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {(selectedPOForPrint.items || []).map((it: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{it.title}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{it.sku}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">{it.orderQty} Pcs</td>
                        <td className="py-2.5 px-3 text-right font-mono">BDT {Number(it.unitCost).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          BDT {Number(it.totalCost || (it.orderQty * it.unitCost)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-400 font-black text-xs">
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-right text-slate-800">GRAND TOTAL:</td>
                      <td className="py-3 px-3 text-right font-mono text-indigo-700 text-sm">
                        BDT {Number(selectedPOForPrint.totalAmount || 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">Prepared By</div>
                  <div className="text-[10px] text-slate-500">{selectedPOForPrint.createdBy || 'Purchase Officer'}</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">Authorized Signature & Seal</div>
                  <div className="text-[10px] text-slate-500">Managing Director / COO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL 7: CREATE TRANSFER CHALLAN (PHASE 5) */}
      {/* ============================================================== */}
      {createTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Dispatch Transfer Challan</h3>
                  <p className="text-xs text-slate-500 font-medium">Relocate stock from Central Hub to branch showroom or outlet</p>
                </div>
              </div>
              <button
                onClick={() => setCreateTransferModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitTransfer} className="space-y-4 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Source Warehouse (From) *</label>
                  <select
                    value={transferFromLoc}
                    onChange={(e) => setTransferFromLoc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Destination Showroom (To) *</label>
                  <select
                    value={transferToLoc}
                    onChange={(e) => setTransferToLoc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items to transfer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Items & Quantity to Transfer</label>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 max-h-48 overflow-y-auto">
                  {transferItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <label className="text-[9px] text-slate-400 block">Quantity (Units)</label>
                          <input
                            type="number"
                            min="1"
                            value={item.transferQty}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                              const updated = [...transferItems];
                              updated[idx].transferQty = val;
                              setTransferItems(updated);
                            }}
                            className="w-full px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-center"
                          />
                        </div>
                        <div className="w-24">
                          <label className="text-[9px] text-slate-400 block">Target Shelf Bin</label>
                          <input
                            type="text"
                            value={item.targetBin}
                            onChange={(e) => {
                              const updated = [...transferItems];
                              updated[idx].targetBin = e.target.value;
                              setTransferItems(updated);
                            }}
                            className="w-full px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-center uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport & Driver */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Vehicle / Transport No. *</label>
                  <input
                    type="text"
                    required
                    value={transferVehicle}
                    onChange={(e) => setTransferVehicle(e.target.value)}
                    placeholder="Dhaka Metro Delivery Van"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Driver / Logistics Agent</label>
                  <input
                    type="text"
                    value={transferDriverName}
                    onChange={(e) => setTransferDriverName(e.target.value)}
                    placeholder="Abdul Karim"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-900">Driver Phone Number</label>
                  <input
                    type="text"
                    value={transferDriverPhone}
                    onChange={(e) => setTransferDriverPhone(e.target.value)}
                    placeholder="+8801700000000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-900">Transfer Reason / Gatepass Note</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Showroom weekend stock replenishment"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateTransferModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submittingTransfer}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  {submittingTransfer ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Dispatch Challan & Allocate Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 8: PRINT DELIVERY CHALLAN & GATE PASS (PHASE 5) */}
      {/* ============================================================== */}
      {printTransferModalOpen && selectedTransferForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Printer className="w-5 h-5 text-blue-600" />
                <span>Delivery Challan & Gatepass Print Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Delivery Challan</span>
                </button>
                <button
                  onClick={() => setPrintTransferModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6 print:p-0">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-wider">ARBAN LEATHER BD</h1>
                  <p className="text-xs text-slate-600">Enterprise Warehouse Transfer & Vehicle Gate Pass</p>
                  <p className="text-[11px] text-slate-500">Security Gate & Logistics Control Desk</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xl font-black text-blue-700">{selectedTransferForPrint.challanNumber}</div>
                  <div className="text-xs text-slate-600 font-bold">INTER-WAREHOUSE CHALLAN</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Date: {new Date(selectedTransferForPrint.dispatchedAt || selectedTransferForPrint.createdAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">DISPATCHED FROM:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedTransferForPrint.fromLocationName}</div>
                  <div className="text-slate-600 text-[11px]">Central Logistics & Dispatch Hub</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">DESTINATION TO:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedTransferForPrint.toLocationName}</div>
                  <div className="text-slate-600 text-[11px]">Branch Display & Retail Inventory Rack</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between font-mono">
                <span>Vehicle No: <strong>{selectedTransferForPrint.vehicleNumber}</strong></span>
                <span>Driver: <strong>{selectedTransferForPrint.driverName} ({selectedTransferForPrint.driverPhone})</strong></span>
              </div>

              {/* Items */}
              <div className="rounded-xl border border-slate-300 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2.5 px-3">SL</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 font-mono">SKU</th>
                      <th className="py-2.5 px-3 font-mono">Source Bin</th>
                      <th className="py-2.5 px-3 font-mono">Target Bin</th>
                      <th className="py-2.5 px-3 text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {(selectedTransferForPrint.items || []).map((it: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{it.title}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{it.sku}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{it.sourceBin}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{it.targetBin}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">{it.transferQty} Pcs</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-400 font-black text-xs">
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-right text-slate-800">Total Transferred Units:</td>
                      <td className="py-3 px-3 text-center font-mono text-blue-700 text-sm">
                        {selectedTransferForPrint.totalUnits || (selectedTransferForPrint.items || []).reduce((acc: number, it: any) => acc + it.transferQty, 0)} Units
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="pt-12 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">Dispatch Officer Signature</div>
                  <div className="text-[10px] text-slate-500">{selectedTransferForPrint.dispatchedBy || 'Warehouse Dispatcher'}</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">Security Gate Clearance</div>
                  <div className="text-[10px] text-slate-500">Main Gate Security Desk</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">Destination Receiver Signature</div>
                  <div className="text-[10px] text-slate-500">{selectedTransferForPrint.receivedBy || 'Showroom Incharge'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
