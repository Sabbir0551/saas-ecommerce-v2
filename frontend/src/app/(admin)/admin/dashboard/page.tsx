'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DynamicFieldRenderer } from '@/components/DynamicFieldRenderer';
import { InventoryManager } from '@/components/InventoryManager';
import {
  Boxes,
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  DollarSign,
  TrendingUp,
  Printer,
  Clock,
  CheckCircle,
  Package,
  Store,
  ArrowLeft,
  Layers,
  Plus,
  Trash2,
  ExternalLink,
  Settings,
  ShieldAlert,
  AlertCircle,
  Award,
  Laptop,
  Ban,
  ShieldCheck,
  Eye,
  Database,
  Save,
  Globe,
  Sliders,
  Sparkles,
  Tag,
  Filter,
  Image as ImageIcon,
  Search,
  Video,
  Play,
  Truck,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Share2,
  Pencil,
  Upload,
  X,
  Film,
  Check,
  ShoppingCart,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Folder,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  BarChart3,
  LineChart,
  PieChart,
  LogOut,
  Zap,
  Shield,
  Rocket,
} from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedSheetDate, setSelectedSheetDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'media' | 'products' | 'categories' | 'brands' | 'settings' | 'modules' | 'appointments' | 'showrooms'>('overview');
  const [productSubTab, setProductSubTab] = useState<'catalog' | 'media'>('catalog');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [revenueMetric, setRevenueMetric] = useState<'MRR' | 'ARR'>('MRR');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Electronics Showrooms state
  const [showroomsList, setShowroomsList] = useState<any[]>([
    {
      id: 'shw_1',
      city: 'Dhaka',
      name: 'Dhanmondi Flagship Experience Center',
      address: 'Plot 42, Road 27 (Old), Dhanmondi R/A, Dhaka-1209',
      phone: '09606 111 777 (Ext 101)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Engr. Tanvir Ahmed',
      isActive: true,
    },
    {
      id: 'shw_2',
      city: 'Dhaka',
      name: 'Uttara Smart Appliance Mega Store',
      address: 'Sector 3, Jasimuddin Avenue (Near North Tower), Uttara, Dhaka',
      phone: '09606 111 777 (Ext 102)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Mahfuzur Rahman',
      isActive: true,
    },
    {
      id: 'shw_3',
      city: 'Dhaka',
      name: 'Mirpur 10 Outlet & Service Hub',
      address: 'Main Road Roundabout, Mirpur 10, Dhaka-1216',
      phone: '09606 111 777 (Ext 103)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Kamrul Hasan',
      isActive: true,
    },
    {
      id: 'shw_4',
      city: 'Chittagong',
      name: 'Agrabad Commercial Showroom',
      address: 'Agrabad Commercial Area, CDA Avenue, Chattogram',
      phone: '09606 111 777 (Ext 201)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Nasir Uddin',
      isActive: true,
    },
    {
      id: 'shw_5',
      city: 'Chittagong',
      name: 'GEC Circle Electronics Hub',
      address: 'Sanmar Ocean City Ground Floor, GEC, Chattogram',
      phone: '09606 111 777 (Ext 202)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Shahed Chowdhury',
      isActive: true,
    },
    {
      id: 'shw_6',
      city: 'Sylhet',
      name: 'Zindabazar Premier Outlet',
      address: 'East Zindabazar, Baruthkhana Point, Sylhet',
      phone: '09606 111 777 (Ext 301)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Foyez Ahmed',
      isActive: true,
    },
    {
      id: 'shw_7',
      city: 'Khulna',
      name: 'KDA Avenue Experience Zone',
      address: 'Shibbari More, KDA Avenue, Khulna',
      phone: '09606 111 777 (Ext 401)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Rezaul Karim',
      isActive: true,
    },
  ]);
  const [newShowroomCity, setNewShowroomCity] = useState('Dhaka');
  const [newShowroomName, setNewShowroomName] = useState('');
  const [newShowroomAddress, setNewShowroomAddress] = useState('');
  const [newShowroomPhone, setNewShowroomPhone] = useState('09606 111 777');
  const [newShowroomManager, setNewShowroomManager] = useState('');
  const [newShowroomHours, setNewShowroomHours] = useState('10:00 AM - 09:00 PM');
  const [showAddShowroomModal, setShowAddShowroomModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [stats, setStats] = useState<any>({
    totalOrders: 18,
    pendingOrders: 4,
    totalBookings: 12,
    totalRevenue: 84500,
  });

  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);

  // Products / Items state
  const [items, setItems] = useState<any[]>([]);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodComparePrice, setProdComparePrice] = useState('');
  const [prodStock, setProdStock] = useState('20');
  const [prodType, setProdType] = useState<'PHYSICAL_PRODUCT' | 'SERVICE_APPOINTMENT' | 'DIGITAL_ITEM'>('PHYSICAL_PRODUCT');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodVideoUrl, setProdVideoUrl] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodBadge, setProdBadge] = useState('');
  const [prodVariants, setProdVariants] = useState('');
  const [prodSpecs, setProdSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'Material', value: '100% Genuine Full-Grain Leather' },
    { key: 'Warranty', value: '2 Years Comprehensive' },
  ]);
  const [activeCategorySchema, setActiveCategorySchema] = useState<any>(null);
  const [prodCustomAttributes, setProdCustomAttributes] = useState<Record<string, any>>({});
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [addingProd, setAddingProd] = useState(false);
  const [prodNotice, setProdNotice] = useState<string | null>(null);
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [selectedProdCatFilter, setSelectedProdCatFilter] = useState('all');
  const [prodSearchQuery, setProdSearchQuery] = useState('');

  // Edit Product Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSaving, setEditingSaving] = useState(false);
  const [editSchema, setEditSchema] = useState<any>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editForm, setEditForm] = useState<any>({
    id: '',
    title: '',
    categoryId: '',
    brandId: '',
    price: '',
    comparePrice: '',
    stockQuantity: '20',
    itemType: 'PHYSICAL_PRODUCT',
    shortDescription: '',
    badge: '',
    variants: '',
    images: [] as string[],
    videoUrl: '',
    isFeatured: false,
    specifications: [] as Array<{ key: string; value: string }>,
    customAttributes: {} as Record<string, any>,
  });

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPromoSlogan, setNewCatPromoSlogan] = useState('');
  const [newCatBannerImage, setNewCatBannerImage] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [catNotice, setCatNotice] = useState<string | null>(null);

  // Brands state
  const [brands, setBrands] = useState<any[]>([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [addingBrand, setAddingBrand] = useState(false);
  const [brandNotice, setBrandNotice] = useState<string | null>(null);

  // Settings state
  const [storeName, setStoreName] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  // Appointment Sheet state
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [loadingSheet, setLoadingSheet] = useState(false);

  // Orders & Bookings state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilterCategory, setOrderFilterCategory] = useState('all');
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderNotice, setOrderNotice] = useState<string | null>(null);
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [manualOrderType, setManualOrderType] = useState<'PHYSICAL_PRODUCT' | 'SERVICE_APPOINTMENT' | 'LEAD_GEN_REAL_ESTATE'>('PHYSICAL_PRODUCT');
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualCity, setManualCity] = useState('Dhaka');
  const [manualItemTitle, setManualItemTitle] = useState('');
  const [manualVariantTitle, setManualVariantTitle] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualQuantity, setManualQuantity] = useState('1');
  const [manualCourier, setManualCourier] = useState('Steadfast Courier');
  const [manualTracking, setManualTracking] = useState('');
  const [manualApptDate, setManualApptDate] = useState(todayStr);
  const [manualApptTime, setManualApptTime] = useState('11:00 AM');
  const [manualPropertyBudget, setManualPropertyBudget] = useState('BDT 45,000,000');
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  // Fraud Prevention, Device, Geolocation & Blacklist States
  const [mapModalOrder, setMapModalOrder] = useState<any | null>(null);
  const [blockModalOrder, setBlockModalOrder] = useState<any | null>(null);
  const [blockReason, setBlockReason] = useState('ভুয়া অর্ডার / বারবার পার্সেল বাতিল ও রিটার্ন');
  const [isBlocking, setIsBlocking] = useState(false);
  const [fraudFilterTab, setFraudFilterTab] = useState<'all' | 'high_risk' | 'blocked' | 'trusted'>('all');
  const [customerHistoryModal, setCustomerHistoryModal] = useState<any | null>(null);
  const [customerHistoryLoading, setCustomerHistoryLoading] = useState(false);

  // Media & Video Gallery state
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategoryId, setMediaCategoryId] = useState('all');
  const [mediaType, setMediaType] = useState<'YOUTUBE' | 'FACEBOOK' | 'IMAGE' | 'DIRECT_VIDEO'>('YOUTUBE');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [addingMedia, setAddingMedia] = useState(false);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);
  const [mediaFilterCategory, setMediaFilterCategory] = useState('all');

  useEffect(() => {
    async function loadTenantData() {
      try {
        const [tenantRes, catRes, brandRes, summaryRes, dbRes, itemsRes, ordersRes, mediaRes] = await Promise.all([
          api.getTenant(tenantSlug),
          api.getTenantCategories(tenantSlug),
          api.getBrands(tenantSlug),
          api.getDashboardSummary(tenantSlug),
          api.getTenantDbStatus(tenantSlug),
          api.getItems({}, tenantSlug),
          api.getOrders({}, tenantSlug),
          api.getMedia({}, tenantSlug),
        ]);

        if (tenantRes?.success && tenantRes.data) {
          const t = tenantRes.data;
          setTenantInfo(t);
          setStoreName(t.name || '');
          setStorePhone(t.phone || '');
          setStoreEmail(t.email || '');
          setStoreAddress(t.address || '');
          setAnnouncementText(t.announcementText || 'Special Launch Offer! Free express delivery across the country on all orders');
        }
        if (ordersRes?.success && Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data);
        }
        if (mediaRes?.success && Array.isArray(mediaRes.data)) {
          setMediaItems(mediaRes.data);
        }
        if (catRes?.success && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
          if (catRes.data.length > 0 && !prodCategoryId) {
            setProdCategoryId(catRes.data[0].id || catRes.data[0].slug);
          }
        }
        if (brandRes?.success && Array.isArray(brandRes.data)) {
          setBrands(brandRes.data);
          if (brandRes.data.length > 0 && !prodBrandId) {
            setProdBrandId(brandRes.data[0].id || brandRes.data[0].slug);
          }
        }
        if (itemsRes?.success && Array.isArray(itemsRes.data)) {
          setItems(itemsRes.data);
        }
        if (summaryRes?.success && summaryRes.data) {
          setStats(summaryRes.data);
        }
        if (dbRes?.success && dbRes.data) {
          setDbInfo(dbRes.data);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    }
    loadTenantData();
  }, [tenantSlug]);

  const refreshCatalogItems = async () => {
    try {
      const itemsRes = await api.getItems({}, tenantSlug);
      if (itemsRes?.success && Array.isArray(itemsRes.data)) {
        setItems(itemsRes.data);
      }
    } catch (err) {
      console.error('Error refreshing items:', err);
    }
  };

  useEffect(() => {
    async function loadSheet() {
      setLoadingSheet(true);
      try {
        const res = await api.getDailyAppointmentsSheet(selectedSheetDate, tenantSlug);
        if (res?.success && res.data?.appointments) {
          setSheetData(res.data.appointments);
        } else {
          setSheetData([
            {
              id: 'b-1',
              serialNumber: 1,
              customerName: 'Michael Anderson',
              customerPhone: '+1 555-019-2834',
              bookingDate: selectedSheetDate,
              bookingTime: '10:00 AM - 11:00 AM',
              status: 'CONFIRMED',
              item: { title: 'Senior Dental Consultation & Full OPG Screening' },
            },
            {
              id: 'b-2',
              serialNumber: 2,
              customerName: 'Sophia Reynolds',
              customerPhone: '+1 555-829-4721',
              bookingDate: selectedSheetDate,
              bookingTime: '11:00 AM - 12:00 PM',
              status: 'CONFIRMED',
              item: { title: '1-Hour Ultrasonic Scaling & Polishing' },
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSheet(false);
      }
    }
    loadSheet();
  }, [selectedSheetDate, tenantSlug]);

  // Load dynamic category schema when category selection changes
  useEffect(() => {
    async function loadSchemaForCategory() {
      if (!prodCategoryId) {
        setActiveCategorySchema(null);
        return;
      }
      setLoadingSchema(true);
      try {
        const selectedCat = categories.find((c) => c.id === prodCategoryId || c.slug === prodCategoryId);
        const catKey = selectedCat?.slug || prodCategoryId;
        const res = await api.getCategorySchema(catKey);
        if (res?.success && res.data) {
          setActiveCategorySchema(res.data);
          // Pre-populate with empty values for each field
          const initialAttrs: Record<string, any> = {};
          res.data.fields?.forEach((f: any) => {
            if (f.type === 'multiselect') initialAttrs[f.key] = [];
            else if (f.type === 'boolean') initialAttrs[f.key] = false;
            else initialAttrs[f.key] = '';
          });
          setProdCustomAttributes(initialAttrs);
        }
      } catch (err) {
        console.error('Failed to load category schema:', err);
      } finally {
        setLoadingSchema(false);
      }
    }
    loadSchemaForCategory();
  }, [prodCategoryId, categories]);

  // If user navigates to media tab, automatically route to products with media sub-tab
  useEffect(() => {
    if (activeTab === 'media') {
      setActiveTab('products');
      setProductSubTab('media');
    }
  }, [activeTab]);

  // Direct Image Upload Handler (with automatic client-side canvas compression for high-res device photos)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (isEdit) {
              setEditForm((prev: any) => ({
                ...prev,
                images: [...(prev.images || []), optimizedDataUrl],
              }));
            } else {
              setProdImages((prev) => [...prev, optimizedDataUrl]);
            }
            return;
          }

          if (isEdit) {
            setEditForm((prev: any) => ({
              ...prev,
              images: [...(prev.images || []), rawDataUrl],
            }));
          } else {
            setProdImages((prev) => [...prev, rawDataUrl]);
          }
        };
        img.onerror = () => {
          if (isEdit) {
            setEditForm((prev: any) => ({
              ...prev,
              images: [...(prev.images || []), rawDataUrl],
            }));
          } else {
            setProdImages((prev) => [...prev, rawDataUrl]);
          }
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev: any) => ({
        ...prev,
        images: (prev.images || []).filter((_: any, idx: number) => idx !== indexToRemove),
      }));
    } else {
      setProdImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    }
  };

  // Open Edit Product Modal
  const handleOpenEditModal = async (item: any) => {
    const existingImages = Array.isArray(item.images)
      ? item.images
      : (item.images ? [item.images] : []);
    const existingVariants = Array.isArray(item.variants)
      ? item.variants.join(', ')
      : (typeof item.variants === 'string' ? item.variants : '');
    const existingSpecs = Array.isArray(item.specifications) && item.specifications.length > 0
      ? item.specifications
      : [{ key: 'Material', value: '' }];

    const catId = item.categoryId || item.category?.id || item.category?.slug || '';

    setEditForm({
      id: item.id,
      title: item.title || '',
      categoryId: catId,
      brandId: item.brandId || item.brand?.id || item.brand?.slug || '',
      price: item.price ? String(item.price) : '',
      comparePrice: item.comparePrice ? String(item.comparePrice) : '',
      stockQuantity: item.stockQuantity !== undefined ? String(item.stockQuantity) : '20',
      itemType: item.itemType || 'PHYSICAL_PRODUCT',
      shortDescription: item.shortDescription || '',
      badge: item.badge || '',
      variants: existingVariants,
      images: existingImages,
      videoUrl: item.videoUrl || '',
      isFeatured: Boolean(item.isFeatured),
      specifications: existingSpecs,
      customAttributes: item.customAttributes || {},
    });

    const selectedCat = categories.find((c) => c.id === catId || c.slug === catId);
    const schemaKey = selectedCat?.slug || catId || tenantSlug;
    try {
      const res = await api.getCategorySchema(schemaKey);
      if (res?.success && res.data) {
        setEditSchema(res.data);
      } else {
        setEditSchema(null);
      }
    } catch {
      setEditSchema(null);
    }

    setEditModalOpen(true);
  };

  const handleEditCategoryChange = async (newCatId: string) => {
    setEditForm((prev: any) => ({ ...prev, categoryId: newCatId }));
    const selectedCat = categories.find((c) => c.id === newCatId || c.slug === newCatId);
    const schemaKey = selectedCat?.slug || newCatId || tenantSlug;
    try {
      const res = await api.getCategorySchema(schemaKey);
      if (res?.success && res.data) {
        setEditSchema(res.data);
      } else {
        setEditSchema(null);
      }
    } catch {
      setEditSchema(null);
    }
  };

  // Save Edited Product
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id || !editForm.title.trim() || !editForm.price) return;
    setEditingSaving(true);
    try {
      const validSpecs = (editForm.specifications || []).filter((s: any) => s.key?.trim() && s.value?.trim());
      const variantList = typeof editForm.variants === 'string'
        ? editForm.variants.split(',').map((v: string) => v.trim()).filter(Boolean)
        : (Array.isArray(editForm.variants) ? editForm.variants : undefined);

      const payload = {
        title: editForm.title.trim(),
        categoryId: editForm.categoryId || undefined,
        brandId: editForm.brandId || undefined,
        price: parseFloat(editForm.price),
        comparePrice: editForm.comparePrice ? parseFloat(editForm.comparePrice) : undefined,
        stockQuantity: parseInt(editForm.stockQuantity, 10) || 0,
        itemType: editForm.itemType,
        shortDescription: editForm.shortDescription?.trim() || undefined,
        images: editForm.images?.length > 0 ? editForm.images : undefined,
        videoUrl: editForm.videoUrl?.trim() || undefined,
        isFeatured: editForm.isFeatured,
        badge: editForm.badge?.trim() || undefined,
        specifications: validSpecs.length > 0 ? validSpecs : undefined,
        customAttributes: editForm.customAttributes && Object.keys(editForm.customAttributes).length > 0
          ? editForm.customAttributes
          : undefined,
        variants: variantList && variantList.length > 0 ? variantList : undefined,
      };

      const res = await api.updateItem(editForm.id, payload, tenantSlug);
      if (res?.success && res.data) {
        setItems((prev) =>
          prev.map((it) => (it.id === editForm.id || it.slug === editForm.id ? { ...it, ...res.data } : it))
        );
        setEditModalOpen(false);
        setProdNotice(`Product "${res.data.title}" updated successfully!`);
        setTimeout(() => setProdNotice(null), 4000);
      } else {
        alert(res?.message || 'Failed to update product');
      }
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert('Error updating product: ' + (err?.message || 'Server error'));
    } finally {
      setEditingSaving(false);
    }
  };

  // Product Actions
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice) return;
    setAddingProd(true);
    try {
      const validSpecs = prodSpecs.filter((s) => s.key.trim() && s.value.trim());
      const variantList = prodVariants
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      const allImages = prodImages.length > 0
        ? prodImages
        : (prodImage.trim() ? [prodImage.trim()] : undefined);

      const res = await api.addItem(
        {
          title: prodTitle.trim(),
          categoryId: prodCategoryId || undefined,
          brandId: prodBrandId || undefined,
          price: parseFloat(prodPrice),
          comparePrice: prodComparePrice ? parseFloat(prodComparePrice) : undefined,
          stockQuantity: parseInt(prodStock, 10) || 0,
          itemType: prodType,
          shortDescription: prodShortDesc.trim() || undefined,
          images: allImages,
          videoUrl: prodVideoUrl.trim() || undefined,
          isFeatured: prodIsFeatured,
          badge: prodBadge.trim() || undefined,
          specifications: validSpecs.length > 0 ? validSpecs : undefined,
          customAttributes: Object.keys(prodCustomAttributes).length > 0 ? prodCustomAttributes : undefined,
          variants: variantList.length > 0 ? variantList : undefined,
        },
        tenantSlug
      );

      if (res?.success && res.data) {
        setItems((prev) => [res.data, ...prev]);
        setProdTitle('');
        setProdPrice('');
        setProdComparePrice('');
        setProdShortDesc('');
        setProdImage('');
        setProdImages([]);
        setProdVideoUrl('');
        setProdBadge('');
        setProdVariants('');
        setShowAddProdModal(false);
        setProdNotice(`Product "${res.data.title}" successfully published to category!`);
        setTimeout(() => setProdNotice(null), 4000);
      } else {
        alert(res?.error || 'Failed to add product');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error creating product: ' + (err?.message || 'Server error'));
    } finally {
      setAddingProd(false);
    }
  };

  const handleExportCatalog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ tenant: tenantSlug, categories, items, exportedAt: new Date().toISOString() }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `catalog_export_${tenantSlug}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the catalog?`)) return;
    try {
      const res = await api.deleteItem(id, tenantSlug);
      if (res?.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setProdNotice(`Product "${title}" deleted successfully.`);
        setTimeout(() => setProdNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Category Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const res = await api.addCategory(
        {
          name: newCatName.trim(),
          promoSlogan: newCatPromoSlogan.trim() || undefined,
          bannerImage: newCatBannerImage.trim() || undefined,
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setCategories((prev) => [...prev, res.data]);
        setNewCatName('');
        setNewCatPromoSlogan('');
        setNewCatBannerImage('');
        setCatNotice(`Category "${res.data.name}" added successfully with promotional slogan!`);
        setTimeout(() => setCatNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await api.deleteCategory(id, tenantSlug);
      if (res?.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
        setCatNotice(`Category "${name}" deleted.`);
        setTimeout(() => setCatNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Brand Actions
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setAddingBrand(true);
    try {
      const res = await api.addBrand({ name: newBrandName.trim(), logo: newBrandLogo.trim() || undefined }, tenantSlug);
      if (res?.success && res.data) {
        setBrands((prev) => [...prev, res.data]);
        setNewBrandName('');
        setNewBrandLogo('');
        setBrandNotice(`Brand "${res.data.name}" created successfully!`);
        setTimeout(() => setBrandNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingBrand(false);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"?`)) return;
    try {
      const res = await api.deleteBrand(id, tenantSlug);
      if (res?.success) {
        setBrands((prev) => prev.filter((b) => b.id !== id && b.slug !== id));
        setBrandNotice(`Brand "${name}" removed.`);
        setTimeout(() => setBrandNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Handlers
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string,
    courier?: string,
    trackingCode?: string
  ) => {
    try {
      const res = await api.updateOrderStatus(
        orderId,
        {
          orderStatus: status,
          courier,
          trackingCode,
        },
        tenantSlug
      );
      if (res?.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  orderStatus: status,
                  ...(courier ? { courier } : {}),
                  ...(trackingCode !== undefined ? { trackingCode } : {}),
                }
              : o
          )
        );
        setOrderNotice(`Order status updated to "${status}"!`);
        setTimeout(() => setOrderNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockCustomer = async (order: any, customReason?: string) => {
    setIsBlocking(true);
    try {
      const targetPhone = order.customerPhone || order.phone;
      const targetEmail = order.customerEmail || order.email;
      const targetIp = order.ipAddress || order.clientIp || order.ip;
      const targetName = order.customerName || order.name;

      const res = await api.blockCustomer(
        {
          phone: targetPhone,
          email: targetEmail,
          ip: targetIp,
          customerName: targetName,
          reason: customReason || blockReason,
        },
        tenantSlug
      );

      if (res?.success) {
        // Refresh orders list
        const updatedOrdersRes = await api.getOrders({}, tenantSlug);
        if (updatedOrdersRes?.success && Array.isArray(updatedOrdersRes.data)) {
          setOrders(updatedOrdersRes.data);
        }
        setBlockModalOrder(null);
        setOrderNotice(`কাস্টমার "${targetName || targetPhone}" কে ব্লক করা হয়েছে।`);
        setTimeout(() => setOrderNotice(null), 3500);
      } else {
        alert(res?.message || 'কাস্টমার ব্লক করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
      alert('সার্ভার এরর');
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblockCustomer = async (target: any) => {
    const targetPhone = typeof target === 'string' ? target : (target?.customerPhone || target?.phone || '');
    const targetEmail = typeof target === 'object' ? (target?.customerEmail || target?.email) : undefined;
    const targetIp = typeof target === 'object' ? (target?.ipAddress || target?.clientIp || target?.ip) : undefined;
    const displayName = typeof target === 'string' ? target : (target?.customerName || target?.customerPhone || 'কাস্টমার');

    try {
      const res = await api.unblockCustomer(
        {
          phone: targetPhone,
          email: targetEmail,
          ip: targetIp,
        },
        tenantSlug
      );

      if (res?.success) {
        const updatedOrdersRes = await api.getOrders({}, tenantSlug);
        if (updatedOrdersRes?.success && Array.isArray(updatedOrdersRes.data)) {
          setOrders(updatedOrdersRes.data);
        }
        setOrderNotice(`কাস্টমার "${displayName}" আনব্লক করা হয়েছে।`);
        setTimeout(() => setOrderNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewCustomerHistory = async (phone: string, customerName: string) => {
    setCustomerHistoryLoading(true);
    setCustomerHistoryModal({ phone, customerName, loading: true });
    try {
      const res = await api.getCustomerHistory(phone, tenantSlug);
      if (res?.success && res.data) {
        setCustomerHistoryModal({
          phone,
          customerName,
          loading: false,
          ...res.data,
        });
      }
    } catch (err) {
      console.error(err);
      setCustomerHistoryModal({ phone, customerName, loading: false, orders: [] });
    } finally {
      setCustomerHistoryLoading(false);
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualCustomerPhone.trim()) return;
    setCreatingManualOrder(true);
    try {
      const res = await api.createManualOrder(
        {
          customerName: manualCustomerName.trim(),
          customerPhone: manualCustomerPhone.trim(),
          shippingAddress: manualAddress.trim(),
          city: manualCity,
          itemTitle: manualItemTitle.trim() || 'Custom Order Item',
          variantTitle: manualVariantTitle.trim() || undefined,
          price: manualPrice,
          quantity: manualQuantity,
          courier: manualCourier,
          trackingCode: manualTracking.trim(),
          orderType: manualOrderType,
          appointmentDate: manualApptDate,
          appointmentTime: manualApptTime,
          budget: manualPropertyBudget,
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setOrders((prev) => [res.data, ...prev]);
        setShowManualOrderModal(false);
        setManualCustomerName('');
        setManualCustomerPhone('');
        setManualAddress('');
        setManualItemTitle('');
        setManualPrice('');
        setOrderNotice(`New order ${res.data.orderNumber} created successfully!`);
        setTimeout(() => setOrderNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingManualOrder(false);
    }
  };

  // Media Handlers
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaUrl.trim()) return;
    setAddingMedia(true);
    try {
      const selectedCat = categories.find((c) => c.id === mediaCategoryId || c.slug === mediaCategoryId);
      const res = await api.addMedia(
        {
          title: mediaTitle.trim(),
          categoryId: mediaCategoryId,
          categoryName: selectedCat ? selectedCat.name : 'General Collection',
          type: mediaType,
          url: mediaUrl.trim(),
          description: mediaDescription.trim(),
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setMediaItems((prev) => [res.data, ...prev]);
        setMediaTitle('');
        setMediaUrl('');
        setMediaDescription('');
        setMediaNotice(`Media "${res.data.title}" published successfully!`);
        setTimeout(() => setMediaNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;
    try {
      const res = await api.deleteMedia(id, tenantSlug);
      if (res?.success) {
        setMediaItems((prev) => prev.filter((m) => m.id !== id));
        setMediaNotice(`Media "${title}" deleted.`);
        setTimeout(() => setMediaNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.updateStoreSettings(
        {
          name: storeName,
          phone: storePhone,
          email: storeEmail,
          address: storeAddress,
          announcementText,
        },
        tenantSlug
      );
      if (res?.success) {
        setSettingsNotice('Store settings and branding saved successfully!');
        if (tenantInfo) setTenantInfo({ ...tenantInfo, name: storeName, phone: storePhone, email: storeEmail, address: storeAddress, announcementText });
        setTimeout(() => setSettingsNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePrint = () => {
    document.body.classList.remove('printing-single-invoice');
    window.print();
  };

  const isServiceOrMedical = tenantInfo?.businessType === 'healthcare_service' || tenantSlug === 'medicare' || tenantSlug === 'meradenralcare';

  const filteredCatalogItems = items.filter((item) => {
    const matchCat =
      selectedProdCatFilter === 'all' ||
      item.categoryId === selectedProdCatFilter ||
      item.category?.id === selectedProdCatFilter ||
      item.category?.slug === selectedProdCatFilter;
    const matchSearch =
      !prodSearchQuery.trim() ||
      item.title?.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      item.shortDescription?.toLowerCase().includes(prodSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* ============================================================== */}
      {/* FLUX LEFT SIDEBAR */}
      {/* ============================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#090D16] border-r border-[#1B2236] transition-all duration-300 print:hidden ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo & Collapse Toggle */}
          <div className="h-16 px-5 border-b border-[#1B2236] flex items-center justify-between shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 overflow-hidden text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#090D16]/40 backdrop-blur-sm rounded-[10px] flex items-center justify-center text-white font-black text-sm">
                  ⚡
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight">
                  <span className="text-base font-extrabold tracking-tight text-white block">Flux</span>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase">
                    DASHBOARD
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-white flex items-center justify-center transition"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-300 ${
                  sidebarCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* GROUP 1: OVERVIEW */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>OVERVIEW</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              )}

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'overview'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-[#111625] hover:text-slate-200 transition"
                title="Analytics"
              >
                <BarChart3 className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Analytics</span>}
              </button>

              <Link
                href={`/?tenant=${tenantSlug}`}
                target="_blank"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-[#111625] hover:text-slate-200 transition"
                title="eCommerce Storefront"
              >
                <Store className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && (
                  <span className="flex items-center justify-between flex-1">
                    <span>eCommerce</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </span>
                )}
              </Link>

              {isServiceOrMedical && (
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'appointments'
                      ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                  }`}
                  title="CRM & Appointments"
                >
                  <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'appointments' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>CRM & Booking</span>}
                </button>
              )}

              <button
                onClick={() => setActiveTab('modules')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'modules'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="SaaS Engine"
              >
                <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'modules' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>SaaS Engine</span>}
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-[#111625] hover:text-slate-200 transition"
                title="Charts"
              >
                <LineChart className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Charts</span>}
              </button>
            </div>

            {/* GROUP 2: COMMERCE */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>COMMERCE</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              )}

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'orders'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Orders"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Orders</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow">
                    {orders.length || stats.totalOrders || 12}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  setProductSubTab('catalog');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'products' && productSubTab === 'catalog'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Products"
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-4 h-4 shrink-0 ${activeTab === 'products' && productSubTab === 'catalog' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Products</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {items.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'inventory'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Inventory & Stock Engine"
              >
                <div className="flex items-center gap-3">
                  <Boxes className={`w-4 h-4 shrink-0 ${activeTab === 'inventory' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Inventory</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Live
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'categories'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Categories"
              >
                <div className="flex items-center gap-3">
                  <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'categories' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Categories</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {categories.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('brands')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'brands'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Brands"
              >
                <div className="flex items-center gap-3">
                  <Award className={`w-4 h-4 shrink-0 ${activeTab === 'brands' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Brands</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {brands.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-[#111625] hover:text-slate-200 transition"
                title="Invoices"
              >
                <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Invoices</span>}
              </button>

              {/* Showrooms & Service Centers for Electronics Archetype */}
              {(tenantInfo?.businessType === 'electronics' || tenantSlug === 'smartvolt') && (
                <button
                  onClick={() => setActiveTab('showrooms')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'showrooms'
                      ? 'bg-[#201A3D] text-orange-400 border border-orange-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                  }`}
                  title="Showrooms & Outlets"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 shrink-0 ${activeTab === 'showrooms' ? 'text-orange-400' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span>Showrooms & Outlets</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800/60">
                      {showroomsList.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* GROUP 3: APPS */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>APPS</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              )}

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-[#111625] hover:text-slate-200 transition"
                title="Mail"
              >
                <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Mail</span>}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-[#111625] hover:text-slate-200 transition"
                title="Chat"
              >
                <MessageSquare className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Chat</span>}
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  setProductSubTab('media');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'products' && productSubTab === 'media'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Files & Media"
              >
                <div className="flex items-center gap-3">
                  <Folder className={`w-4 h-4 shrink-0 ${activeTab === 'products' && productSubTab === 'media' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Files & Media</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {mediaItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'settings'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Store Settings"
              >
                <Sliders className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </div>
          </div>

          {/* User Profile Card (Bottom of Sidebar) */}
          <div className="p-3 border-t border-[#1B2236] shrink-0 bg-[#070A11]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#111625]/80 border border-[#1E2638]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow">
                  AS
                </div>
                {!sidebarCollapsed && (
                  <div className="leading-tight overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">
                      {tenantInfo?.name ? tenantInfo.name.split(' ')[0] + ' S.' : 'Aigars S.'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Admin</p>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-1">
                  <Link
                    href="/super-admin"
                    className="w-7 h-7 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center transition"
                    title="SaaS Central Super-Admin"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/?tenant=${tenantSlug}`}
                    target="_blank"
                    className="w-7 h-7 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 flex items-center justify-center transition"
                    title="View Storefront"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN CONTENT COLUMN */}
      {/* ============================================================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <header className="h-16 bg-[#090D16]/95 backdrop-blur-md border-b border-[#1B2236] sticky top-0 z-40 px-6 flex items-center justify-between print:hidden">
          {/* Search bar */}
          <div className="relative w-72 sm:w-96 max-w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setProdSearchQuery(e.target.value);
                setOrderSearchQuery(e.target.value);
              }}
              className="w-full bg-[#111625] border border-[#1E2638] rounded-xl pl-9 pr-12 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#1A2234] border border-[#232D44] text-[10px] font-mono text-slate-400">
              ⌘K
            </span>
          </div>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-3">
            {/* + New Order Button (Vibrant Gradient Pill from Screenshot) */}
            <button
              onClick={() => setShowManualOrderModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>

            {/* + Add Product Button */}
            <button
              onClick={() => {
                setActiveTab('products');
                setProductSubTab('catalog');
                setShowAddProdModal(true);
              }}
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-200 font-bold text-xs items-center gap-1.5 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
              <span>Add Product</span>
            </button>

            {/* Super Admin Command Center Link */}
            <Link
              href="/super-admin"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              title="SaaS Central Super-Admin Command Hub"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Super Admin</span>
            </Link>

            {/* Database Telemetry Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111625] border border-[#1E2638] text-xs font-mono text-cyan-400 shadow-inner">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>DB: {dbInfo?.dbName || `tenant_${tenantSlug}`}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Database Isolated & Online"></span>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-9 h-9 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-slate-200 flex items-center justify-center transition"
              title="Toggle Theme"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* AI / Sparkles */}
            <button
              onClick={() => setActiveTab('modules')}
              className="w-9 h-9 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-indigo-400 flex items-center justify-center transition"
              title="Store Modules"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('orders')}
              className="w-9 h-9 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-slate-200 flex items-center justify-center relative transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            {/* Profile Avatar Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center shadow-sm hover:ring-2 hover:ring-cyan-500/50 transition cursor-pointer"
                title="Profile Menu & Switcher"
              >
                AS
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0E1320] border border-[#1E2638] rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-[#1E2638]/80">
                    <p className="font-bold text-white text-xs truncate">{tenantInfo?.name || 'Active Merchant'}</p>
                    <p className="text-[11px] text-cyan-400 font-mono">store: {tenantSlug}</p>
                  </div>
                  <Link
                    href="/super-admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/10 transition font-semibold"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Super-Admin Hub</span>
                  </Link>
                  <Link
                    href={`/?tenant=${tenantSlug}`}
                    target="_blank"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-300 hover:bg-emerald-500/10 transition font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Live Storefront</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1A2234] transition"
                  >
                    <LogOut className="w-4 h-4 text-slate-500" />
                    <span>Switch Store / Logout</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className="p-6 lg:p-8 space-y-6 flex-1 w-full max-w-[1600px] mx-auto">
          {/* ============================================================== */}
          {/* TAB 1: FLUX OVERVIEW & DASHBOARD */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* TOP HERO GREETING BANNER WITH GLASSMORPHISM METRIC CARDS */}
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#5848FD] via-[#7B53FF] to-[#00C5FF] text-white shadow-2xl relative overflow-hidden">
                {/* Background Ambient Glow Accents */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-indigo-900/30 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Good morning, {tenantInfo?.name || 'Aigars'}
                      </h2>
                      <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 font-medium">
                        Here&apos;s what&apos;s happening with your product today.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>PostgreSQL DB Isolated</span>
                      </span>
                    </div>
                  </div>

                  {/* 4 Glassmorphism Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {/* Card 1: MRR */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>MRR</span>
                        </span>
                        <span className="text-[10px] text-indigo-200 uppercase font-mono">Gross Revenue</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        {stats.totalRevenue ? `BDT ${(stats.totalRevenue).toLocaleString()}` : '$48.2K'}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +12.4%</span>
                        <span className="text-indigo-200/80 font-normal">vs last month</span>
                      </div>
                    </div>

                    {/* Card 2: Active Users */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-sky-300" />
                          <span>Active Users</span>
                        </span>
                        <span className="text-[10px] text-indigo-200 uppercase font-mono">Shoppers & Leads</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        {orders.length ? (orders.length * 714).toLocaleString() : '12,847'}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +8.2%</span>
                        <span className="text-indigo-200/80 font-normal">vs last month</span>
                      </div>
                    </div>

                    {/* Card 3: Deployments */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Rocket className="w-3.5 h-3.5 text-purple-200" />
                          <span>Deployments</span>
                        </span>
                        <span className="text-[10px] text-indigo-200 uppercase font-mono">Catalog Items</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        {items.length ? (items.length * 34 + 2) : '342'}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +24.1%</span>
                        <span className="text-indigo-200/80 font-normal">vs last month</span>
                      </div>
                    </div>

                    {/* Card 4: Uptime */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Uptime</span>
                        </span>
                        <span className="text-[10px] text-emerald-300 uppercase font-mono">99.98%</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        99.98%
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +0.02%</span>
                        <span className="text-indigo-200/80 font-normal">vs last month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: REVENUE GROWTH CHART + SPRINT 24 + TEAM ACTIVITY */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Revenue Growth Card (8 cols) */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Revenue Growth</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Monthly recurring revenue trend</p>
                    </div>

                    {/* MRR / ARR Toggle Pill */}
                    <div className="p-1 rounded-xl bg-[#090D16] border border-[#1E2638] flex items-center gap-1">
                      <button
                        onClick={() => setRevenueMetric('MRR')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          revenueMetric === 'MRR'
                            ? 'bg-[#1E2638] text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        MRR
                      </button>
                      <button
                        onClick={() => setRevenueMetric('ARR')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          revenueMetric === 'ARR'
                            ? 'bg-[#1E2638] text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ARR
                      </button>
                    </div>
                  </div>

                  {/* Spline Chart SVG */}
                  <div className="mt-6 w-full">
                    <div className="flex">
                      {/* Y-axis labels */}
                      <div className="flex flex-col justify-between text-[11px] font-mono text-slate-500 pr-3 h-56 select-none">
                        <span>$60K</span>
                        <span>$45K</span>
                        <span>$30K</span>
                        <span>$15K</span>
                        <span>$0K</span>
                      </div>

                      {/* SVG Area */}
                      <div className="flex-1 relative h-56">
                        {/* Horizontal Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                        </div>

                        <svg viewBox="0 0 700 220" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="fluxRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Area Fill */}
                          <path
                            d={
                              revenueMetric === 'MRR'
                                ? "M 0,170 C 110,165 190,150 280,135 C 370,120 460,95 560,75 C 620,65 670,55 700,45 L 700,220 L 0,220 Z"
                                : "M 0,185 C 100,180 200,160 300,140 C 400,115 500,85 600,60 C 650,45 680,35 700,25 L 700,220 L 0,220 Z"
                            }
                            fill="url(#fluxRevenueGrad)"
                          />
                          {/* Curved Spline */}
                          <path
                            d={
                              revenueMetric === 'MRR'
                                ? "M 0,170 C 110,165 190,150 280,135 C 370,120 460,95 560,75 C 620,65 670,55 700,45"
                                : "M 0,185 C 100,180 200,160 300,140 C 400,115 500,85 600,60 C 650,45 680,35 700,25"
                            }
                            fill="none"
                            stroke="#A78BFA"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          {/* Glowing endpoint marker */}
                          <circle
                            cx="700"
                            cy={revenueMetric === 'MRR' ? "45" : "25"}
                            r="6"
                            fill="#C4B5FD"
                            stroke="#090D16"
                            strokeWidth="2.5"
                            className="animate-pulse"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between pl-10 pr-2 pt-3 text-[11px] font-mono text-slate-500">
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                      <span>Jan</span>
                    </div>
                  </div>
                </div>

                {/* Right: Stack of 2 Cards (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Card 1: Sprint 24 / Fulfillment Pipeline */}
                  <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Sprint 24</h3>
                        <p className="text-xs text-slate-400 mt-0.5">5 days remaining</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                      >
                        <span>View board</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Segmented Progress Bar */}
                    <div className="mt-5">
                      <div className="h-3.5 rounded-full bg-[#1A2234] p-0.5 flex gap-1 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-l-full h-full w-[65%]" title="Completed (14)"></div>
                        <div className="bg-sky-400 h-full w-[25%]" title="In Progress (5)"></div>
                        <div className="bg-amber-500 rounded-r-full h-full w-[10%]" title="To Do (2)"></div>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-4 mt-4 text-xs text-slate-300 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                          <span>Completed (14)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          <span>In Progress (5)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span>To Do (2)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Team Activity */}
                  <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Team Activity</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Latest from your team</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                      >
                        <span>View all</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Activity Feed */}
                    <div className="mt-4 space-y-3.5">
                      {[
                        { initials: 'SC', name: 'Sarah C.', action: 'merged PR #284', time: '3m', color: 'bg-cyan-500 text-slate-950' },
                        { initials: 'AM', name: 'Alex M.', action: 'deployed to production', time: '12m', color: 'bg-emerald-500 text-slate-950' },
                        { initials: 'PK', name: 'Priya K.', action: 'opened issue #92', time: '28m', color: 'bg-purple-500 text-white' },
                        { initials: 'ML', name: 'Marcus L.', action: 'reviewed PR #281', time: '45m', color: 'bg-rose-500 text-white' },
                        { initials: 'JT', name: 'Jen T.', action: 'closed issue #88', time: '1h', color: 'bg-indigo-500 text-white' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${item.color}`}>
                              {item.initials}
                            </span>
                            <p className="text-slate-300 leading-tight">
                              <span className="font-bold text-white">{item.name}</span>{' '}
                              <span className="text-slate-400">{item.action}</span>
                            </p>
                          </div>
                          <span className="text-slate-500 text-[11px] font-mono shrink-0 pl-2">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: RECENT DEPLOYMENTS + FEATURE ADOPTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Recent Deployments (6 cols) */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Recent Deployments</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Latest releases across environments</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                    >
                      <span>View all</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Deployments List */}
                  <div className="mt-5 space-y-4">
                    {[
                      {
                        title: 'fix: auth token refresh',
                        status: 'ok',
                        env: 'Production',
                        envColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                        branch: 'main',
                        time: '2 min ago',
                      },
                      {
                        title: 'feat: webhook retry logic',
                        status: 'ok',
                        env: 'Staging',
                        envColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                        branch: 'feat/webhooks-v2',
                        time: '18 min ago',
                      },
                      {
                        title: 'chore: bump dependencies',
                        status: 'ok',
                        env: 'Production',
                        envColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                        branch: 'main',
                        time: '1h ago',
                      },
                      {
                        title: 'feat: dark mode toggle',
                        status: 'pending',
                        env: 'Preview',
                        envColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                        branch: 'feat/dark-mode',
                        time: '1h ago',
                      },
                      {
                        title: 'fix: websocket memory leak',
                        status: 'error',
                        env: 'Staging',
                        envColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                        branch: 'fix/memory-leak',
                        time: '3h ago',
                      },
                      {
                        title: 'feat: export CSV endpoint',
                        status: 'ok',
                        env: 'Production',
                        envColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                        branch: 'main',
                        time: '5h ago',
                      },
                    ].map((dep, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-3">
                          {/* Status dot icon */}
                          <div className="shrink-0">
                            {dep.status === 'ok' && (
                              <div className="w-5 h-5 rounded-full border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                              </div>
                            )}
                            {dep.status === 'pending' && (
                              <div className="w-5 h-5 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400">
                                <Clock className="w-3 h-3" />
                              </div>
                            )}
                            {dep.status === 'error' && (
                              <div className="w-5 h-5 rounded-full border border-rose-500/40 flex items-center justify-center text-rose-400">
                                <AlertCircle className="w-3 h-3" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-white tracking-tight">{dep.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${dep.envColor}`}>
                                {dep.env}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <span>-o-</span>
                                <span>{dep.branch}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-slate-500 shrink-0">{dep.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Feature Adoption / Category Performance (6 cols) */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Feature Adoption</h3>
                        <p className="text-xs text-slate-400 mt-0.5">% of users using each feature</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('modules')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                      >
                        <span>Flags</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div className="mt-6 space-y-4">
                      {[
                        { label: 'Dashboard', percent: 88 },
                        { label: 'API', percent: 76 },
                        { label: 'Webhooks', percent: 64 },
                        { label: 'Team Mgmt', percent: 52 },
                        { label: 'SSO', percent: 36 },
                        { label: 'Audit Log', percent: 22 },
                      ].map((feat, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <span className="w-24 text-right pr-4 font-medium text-slate-300 shrink-0">{feat.label}</span>
                          <div className="flex-1 h-3 rounded-full bg-[#1A2234] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 transition-all duration-500"
                              style={{ width: `${feat.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* X-axis percentage scale */}
                  <div className="flex justify-between pl-24 pt-4 text-[10px] font-mono text-slate-500 border-t border-[#1E2638] mt-6">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* QUICK STORE ACTIONS STRIP */}
              <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Store Management</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setProductSubTab('catalog');
                      setShowAddProdModal(true);
                    }}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <ShoppingBag className="w-4 h-4 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Add Product</span>
                    <span className="text-[10px] text-slate-400">Direct upload</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Layers className="w-4 h-4 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Categories</span>
                    <span className="text-[10px] text-slate-400">{categories.length} Taxonomies</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('brands')}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Award className="w-4 h-4 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Brands</span>
                    <span className="text-[10px] text-slate-400">{brands.length} Registered</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Sliders className="w-4 h-4 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Settings</span>
                    <span className="text-[10px] text-slate-400">Branding & Banners</span>
                  </button>

                  <Link
                    href={`/?tenant=${tenantSlug}`}
                    target="_blank"
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Store className="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Storefront</span>
                    <span className="text-[10px] text-slate-400">Live Customer View</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

        {/* ============================================================== */}
        {/* TAB: CATEGORY-TAILORED ORDER & APPOINTMENT MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orderNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{orderNotice}</span>
              </div>
            )}

            {/* Orders Header Banner */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Fulfillment & Operations</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Category-Tailored Order & Booking Management</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage physical goods shipments via Steadfast/Pathao, doctor clinical slots, and real estate buyer leads.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowManualOrderModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Manual Order</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet</span>
                </button>
              </div>
            </div>

            {/* Category Type Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <button
                onClick={() => setOrderFilterCategory('all')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  orderFilterCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                All Categories ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilterCategory('physical_product')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  orderFilterCategory === 'physical_product'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                📦 Physical Goods Courier ({orders.filter((o) => o.orderType === 'PHYSICAL_PRODUCT').length})
              </button>
              <button
                onClick={() => setOrderFilterCategory('service_appointment')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  orderFilterCategory === 'service_appointment'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                🏥 Doctor & Clinic Slots ({orders.filter((o) => o.orderType === 'SERVICE_APPOINTMENT').length})
              </button>
              <button
                onClick={() => setOrderFilterCategory('lead_gen_real_estate')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  orderFilterCategory === 'lead_gen_real_estate'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                🏡 Real Estate Leads ({orders.filter((o) => o.orderType === 'LEAD_GEN_REAL_ESTATE').length})
              </button>
            </div>

            {/* Secondary Status & Search Filter */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search customer, phone, order #..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
                {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CONFIRMED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilterStatus(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderFilterStatus === st
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Security & Fraud Intelligence Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>সিকিউরিটি ফিল্টার:</span>
              </span>
              {[
                { id: 'all', label: 'সব অর্ডার (All)' },
                { id: 'high_risk', label: '🚨 ভুয়া অর্ডার ঝুঁকি (High Risk)', color: 'text-rose-700 bg-rose-50 border-rose-300' },
                { id: 'blocked', label: '🚫 ব্লক করা কাস্টমার (Blocked)', color: 'text-red-700 bg-red-50 border-red-300' },
                { id: 'trusted', label: '💎 বিশ্বস্ত কাস্টমার (Trusted)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFraudFilterTab(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                    fraudFilterTab === f.id
                      ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                      : f.color || 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Orders Cards List */}
            {(() => {
              const filteredOrders = orders.filter((ord) => {
                const matchCat =
                  orderFilterCategory === 'all' ||
                  ord.businessCategory?.toLowerCase() === orderFilterCategory.toLowerCase() ||
                  ord.orderType?.toLowerCase() === orderFilterCategory.toLowerCase();
                const matchStatus =
                  orderFilterStatus === 'all' ||
                  ord.orderStatus?.toLowerCase() === orderFilterStatus.toLowerCase() ||
                  ord.consultationStatus?.toLowerCase() === orderFilterStatus.toLowerCase();
                const matchSearch =
                  !orderSearchQuery.trim() ||
                  ord.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  ord.customerPhone?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  ord.orderNumber?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  (ord.clientIp && ord.clientIp.toLowerCase().includes(orderSearchQuery.toLowerCase()));
                
                let matchFraud = true;
                if (fraudFilterTab === 'high_risk') {
                  matchFraud = ord.customerHistory?.trustScore === 'RISK' || (ord.customerHistory?.deliverySuccessRate != null && ord.customerHistory.deliverySuccessRate < 50) || ord.addressDiscrepancy === true;
                } else if (fraudFilterTab === 'blocked') {
                  matchFraud = ord.isBlockedCustomer === true;
                } else if (fraudFilterTab === 'trusted') {
                  matchFraud = ord.customerHistory?.trustScore === 'EXCELLENT' || ord.customerHistory?.trustScore === 'GOOD';
                }

                return matchCat && matchStatus && matchSearch && matchFraud;
              });

              if (filteredOrders.length === 0) {
                return (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600 text-sm">No orders matching the current filter</p>
                    <p className="mt-1">Try switching category tabs or clearing the search query.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Printable Manifest Header (Only visible when printing sheet) */}
                  <div className="hidden print:block pb-4 mb-4 border-b-2 border-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                          {tenantInfo?.name || 'Merchant Store'} — Daily Courier Dispatch & Order Sheet
                        </h1>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Store ID: {tenantSlug} | Helpline: {tenantInfo?.phone || '+880 1811-223344'} | Address: {tenantInfo?.address || 'Dhaka, Bangladesh'}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-800">
                        <p className="font-bold">Date: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-[11px] font-semibold text-slate-600">Total Manifest Orders: {filteredOrders.length}</p>
                      </div>
                    </div>
                  </div>

                  {filteredOrders.map((ord) => {
                    const isMed = ord.orderType === 'SERVICE_APPOINTMENT';
                    const isEstate = ord.orderType === 'LEAD_GEN_REAL_ESTATE';

                    return (
                      <div
                        key={ord.id || ord.orderNumber}
                        className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4 print:p-4 print:rounded-2xl print:border-slate-800 print:shadow-none print:break-inside-avoid print:mb-4"
                      >
                        {/* Header: Order Number, Category & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                isMed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isEstate
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {isMed ? 'Doctor Clinical Slot' : isEstate ? 'Real Estate Buyer Lead' : 'Physical Courier Parcel'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'CONFIRMED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'SHIPPED'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : ord.orderStatus === 'PROCESSING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {ord.orderStatus || 'PENDING'}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Category-Specific Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Customer Details & Fraud Intelligence */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Customer Contact
                              </span>
                              {/* Trust Score Badge */}
                              {ord.isBlockedCustomer ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-300">
                                  <Ban className="w-3 h-3 text-red-600" />
                                  🚫 ব্লক করা কাস্টমার
                                </span>
                              ) : ord.addressDiscrepancy ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  🚨 ভুয়া অর্ডার ঝুঁকি (IP অমিল)
                                </span>
                              ) : ord.customerHistory?.trustScore === 'EXCELLENT' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Award className="w-3 h-3 text-emerald-600" />
                                  💎 অত্যন্ত বিশ্বস্ত ({ord.customerHistory?.deliverySuccessRate}%)
                                </span>
                              ) : ord.customerHistory?.trustScore === 'GOOD' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300">
                                  <CheckCircle className="w-3 h-3 text-blue-600" />
                                  ✓ বিশ্বস্ত ({ord.customerHistory?.deliverySuccessRate}%)
                                </span>
                              ) : ord.customerHistory?.trustScore === 'RISK' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  ⚠️ সন্দেহজনক কাস্টমার ({ord.customerHistory?.deliverySuccessRate}%)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  ✨ নতুন কাস্টমার
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{ord.customerName}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`tel:${ord.customerPhone}`} className="hover:text-rose-600 font-mono font-bold">
                                  {ord.customerPhone}
                                </a>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleViewCustomerHistory(ord.customerPhone, ord.customerName)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 transition hover:bg-indigo-100"
                                title="কাস্টমারের আগের সব অর্ডার হিস্ট্রি দেখুন"
                              >
                                <Eye className="w-3 h-3" />
                                <span>হিস্ট্রি</span>
                              </button>
                            </div>

                            {/* Customer Lifetime Delivery Stats Pill */}
                            {ord.customerHistory && (
                              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                                <div className="flex items-center justify-between text-slate-600 font-semibold text-[10px]">
                                  <span>লাইফটাইম অর্ডার রেকর্ড:</span>
                                  <span className="font-mono font-bold text-slate-900">মোট {ord.customerHistory.totalOrders} টি</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                                  <div className="bg-emerald-50 text-emerald-800 rounded p-1 border border-emerald-200">
                                    <span className="block font-bold">✓ {ord.customerHistory.deliveredOrders}</span>
                                    <span className="text-[9px] text-emerald-600 font-sans">সফল</span>
                                  </div>
                                  <div className="bg-rose-50 text-rose-800 rounded p-1 border border-rose-200">
                                    <span className="block font-bold">✕ {ord.customerHistory.cancelledOrders}</span>
                                    <span className="text-[9px] text-rose-600 font-sans">বাতিল</span>
                                  </div>
                                  <div className="bg-indigo-50 text-indigo-800 rounded p-1 border border-indigo-200">
                                    <span className="block font-bold">{ord.customerHistory.deliverySuccessRate}%</span>
                                    <span className="text-[9px] text-indigo-600 font-sans">সফলতার হার</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Shipping Delivery Address */}
                            <div className="flex items-start gap-2 text-xs text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>
                                {ord.shippingAddress}, <strong>{ord.city}</strong>
                              </span>
                            </div>

                            {/* Device & Client IP Geolocation Card */}
                            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 text-[11px] space-y-1.5 border border-slate-800 shadow-inner">
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span className="flex items-center gap-1 font-mono uppercase tracking-wider">
                                  <Laptop className="w-3 h-3 text-cyan-400" />
                                  <span>{ord.deviceType || 'Device'} • {ord.os || 'OS'} ({ord.browser || 'Browser'})</span>
                                </span>
                              </div>
                              <div className="flex items-center justify-between font-mono text-xs">
                                <span className="text-cyan-300 font-bold">{ord.clientIp || '103.205.71.42'}</span>
                                <span className="text-slate-300 text-[10px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                  📍 IP: {ord.ipCity || 'Dhaka'}
                                </span>
                              </div>

                              {/* Address Discrepancy Alert */}
                              {ord.addressDiscrepancy && (
                                <div className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 text-[10px] flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span>
                                    <strong>সতর্কতা:</strong> IP সিটি ({ord.ipCity}) ও ডেলিভারি সিটি ({ord.city}) আলাদা!
                                  </span>
                                </div>
                              )}

                              {/* Google Maps Button */}
                              <button
                                type="button"
                                onClick={() => setMapModalOrder(ord)}
                                className="w-full mt-1 py-1 px-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 font-bold text-[10px] transition flex items-center justify-center gap-1.5"
                              >
                                <Globe className="w-3 h-3 text-cyan-400" />
                                <span>গুগল ম্যাপে IP লোকেশন পিন দেখুন</span>
                              </button>
                            </div>

                            {ord.notes && (
                              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100 mt-2">
                                Note: {ord.notes}
                              </p>
                            )}
                          </div>

                          {/* Category Specific Block */}
                          <div className="md:col-span-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                            {/* Physical Goods */}
                            {!isMed && !isEstate && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Courier Shipment & Fulfillment
                                  </span>
                                  <span className="text-xs font-bold text-emerald-600">
                                    Payment: {ord.paymentMethod || 'COD (Cash on Delivery)'}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  {ord.items?.map((it: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-800">
                                          {it.itemTitle || it.title} {it.variantTitle ? `(${it.variantTitle})` : ''} × {it.quantity || 1}
                                        </span>
                                        {ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'SHIPPED' ? (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                            ✓ Dispatched
                                          </span>
                                        ) : ord.orderStatus === 'CANCELLED' ? (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-300">
                                            🔓 Stock Unlocked
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                            🔒 Stock Reserved ({it.quantity || 1})
                                          </span>
                                        )}
                                      </div>
                                      <span className="font-mono text-slate-700 font-bold">
                                        BDT {(it.price * (it.quantity || 1)).toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                                    <span>Delivery Fee ({ord.city}):</span>
                                    <span>BDT {ord.deliveryCharge || 60}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-1">
                                    <span>Total Payable:</span>
                                    <span className="text-rose-600 font-black">BDT {ord.totalAmount?.toLocaleString()}</span>
                                  </div>
                                </div>

                                {/* Courier Assignment & Tracking Row */}
                                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-3">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                                    <Truck className="w-3.5 h-3.5 text-indigo-500 print:hidden" />
                                    <span>Courier: {ord.courier || 'Pending'}</span>
                                    {ord.trackingCode && (
                                      <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-mono print:border print:border-slate-400">
                                        Track: {ord.trackingCode}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 ml-auto print:hidden">
                                    <select
                                      defaultValue={ord.courier || 'Steadfast Courier'}
                                      onChange={(e) => {
                                        const newCourier = e.target.value;
                                        const code = ord.trackingCode || `${newCourier.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
                                        handleUpdateOrderStatus(ord.id, ord.orderStatus || 'PROCESSING', newCourier, code);
                                      }}
                                      className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1 font-medium text-slate-700"
                                    >
                                      <option value="Steadfast Courier">Steadfast Courier</option>
                                      <option value="Pathao Courier">Pathao Courier</option>
                                      <option value="RedX Delivery">RedX Delivery</option>
                                      <option value="Paperfly Express">Paperfly Express</option>
                                    </select>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Healthcare Clinic */}
                            {isMed && (
                              <div className="space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                                  Reserved Doctor Appointment
                                </span>
                                <div className="text-sm font-extrabold text-slate-900">
                                  {ord.serviceTitle || ord.items?.[0]?.itemTitle || 'Senior Dental Consultation'}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Date & Time Slot:</span>
                                    <span className="font-bold text-slate-800">
                                      {ord.appointmentDate || 'Today'}, {ord.appointmentTime || '11:00 AM'}
                                    </span>
                                  </div>
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Slot Serial #:</span>
                                    <span className="font-bold text-emerald-600 font-mono">#{ord.serialNumber || 1}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Real Estate */}
                            {isEstate && (
                              <div className="space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                                  Luxury Property Inquiry
                                </span>
                                <div className="text-sm font-extrabold text-slate-900">
                                  {ord.propertyTitle || 'The Grand Regal Country Estate'}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Buyer Budget:</span>
                                    <span className="font-bold text-amber-600">{ord.budget || 'BDT 45,000,000'}</span>
                                  </div>
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Site Visit:</span>
                                    <span className="font-bold text-slate-800">{ord.siteVisitDate || 'Scheduled on request'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Custom Attributes Snapshot (Metafield Attributes) */}
                        {ord.customAttributes && Object.keys(ord.customAttributes).length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5 text-xs">
                            <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Order Specifications (Dynamic Custom Attributes)</span>
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                              {Object.entries(ord.customAttributes).map(([k, v]: [string, any]) => (
                                <div key={k} className="p-2 rounded-xl bg-white border border-indigo-100">
                                  <span className="text-[10px] text-slate-400 block font-semibold">{k.replace(/_/g, ' ')}</span>
                                  <span className="font-bold text-slate-900 truncate block">
                                    {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Order Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Change Status:</span>
                            <select
                              value={ord.orderStatus || 'PENDING'}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Block / Unblock Customer Button */}
                            {ord.isBlockedCustomer ? (
                              <button
                                onClick={() => handleUnblockCustomer(ord.customerPhone)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 transition flex items-center gap-1 shadow-sm active:scale-95"
                                title="কাস্টমার আনব্লক করুন"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>আনব্লক করুন</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setBlockModalOrder(ord)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center gap-1 shadow-sm active:scale-95"
                                title="ভুয়া কাস্টমার ব্লক করুন"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span>কাস্টমার ব্লক</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                handleUpdateOrderStatus(ord.id, 'DELIVERED');
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                            >
                              Mark Delivered
                            </button>
                            <button
                              onClick={() => setInvoiceOrder(ord)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 shadow-sm active:scale-95"
                              title="Print Single Customer Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Invoice</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Modal: Manual Order Creation */}
        {showManualOrderModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Create Manual Order / Booking</h3>
                  <p className="text-xs text-slate-500">Record an order received over phone or counter</p>
                </div>
                <button
                  onClick={() => setShowManualOrderModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order Type / Category</label>
                  <select
                    value={manualOrderType}
                    onChange={(e) => setManualOrderType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="PHYSICAL_PRODUCT">📦 Physical Product (Courier Delivery)</option>
                    <option value="SERVICE_APPOINTMENT">🏥 Doctor Clinical Appointment</option>
                    <option value="LEAD_GEN_REAL_ESTATE">🏡 Luxury Real Estate Lead</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={manualCustomerName}
                      onChange={(e) => setManualCustomerName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={manualCustomerPhone}
                      onChange={(e) => setManualCustomerPhone(e.target.value)}
                      placeholder="+880 1711-..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="House, Road, Area"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      placeholder="Dhaka"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Item / Service Title</label>
                    <input
                      type="text"
                      value={manualItemTitle}
                      onChange={(e) => setManualItemTitle(e.target.value)}
                      placeholder="e.g. Leather Briefcase"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Option / Variant</label>
                    <input
                      type="text"
                      value={manualVariantTitle}
                      onChange={(e) => setManualVariantTitle(e.target.value)}
                      placeholder="e.g. Cognac Tan"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price (BDT)</label>
                    <input
                      type="number"
                      value={manualPrice}
                      onChange={(e) => setManualPrice(e.target.value)}
                      placeholder="5200"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Courier Partner</label>
                    <select
                      value={manualCourier}
                      onChange={(e) => setManualCourier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    >
                      <option value="Steadfast Courier">Steadfast Courier</option>
                      <option value="Pathao Courier">Pathao Courier</option>
                      <option value="RedX Delivery">RedX Delivery</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowManualOrderModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingManualOrder}
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow"
                  >
                    {creatingManualOrder ? 'Creating...' : 'Save Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Single Order Printable Customer Invoice / Packing Slip */}
        {invoiceOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0 print:border-none print:overflow-visible text-slate-900">
              {/* Modal Top Actions - Hidden in Print */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-xl">
                    INVOICE: {invoiceOrder.orderNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Customer Printable Slip</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      document.body.classList.add('printing-single-invoice');
                      window.print();
                      document.body.classList.remove('printing-single-invoice');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setInvoiceOrder(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Document Body */}
              <div className="space-y-6 print:space-y-4 p-2 sm:p-4 text-slate-900">
                {/* Invoice Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                      {tenantInfo?.name || 'Merchant Store'}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
                      {tenantInfo?.address || 'Dhaka, Bangladesh'}
                    </p>
                    <p className="text-xs text-slate-600">
                      Helpline: <strong className="text-slate-900">{tenantInfo?.phone || '+880 1811-223344'}</strong>
                    </p>
                    {tenantInfo?.email && (
                      <p className="text-xs text-slate-500">Email: {tenantInfo.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-black uppercase tracking-wider mb-1 print:border print:border-black print:text-black print:bg-white">
                      INVOICE / PACKING SLIP
                    </span>
                    <div className="font-mono text-sm font-black text-slate-950 mt-1">
                      {invoiceOrder.orderNumber}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date: {new Date(invoiceOrder.createdAt).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">
                      Payment: {invoiceOrder.paymentMethod || 'Cash on Delivery (COD)'}
                    </p>
                  </div>
                </div>

                {/* Recipient & Shipping Information */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                      BILL TO / DELIVER TO:
                    </span>
                    <p className="font-black text-slate-950 text-sm">{invoiceOrder.customerName}</p>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{invoiceOrder.customerPhone}</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {invoiceOrder.shippingAddress}, {invoiceOrder.city}
                    </p>
                    {invoiceOrder.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1.5">Note: {invoiceOrder.notes}</p>
                    )}
                  </div>

                  <div className="border-l border-slate-200 pl-4 print:border-slate-800">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                      DISPATCH & COURIER DETAILS:
                    </span>
                    <p className="font-bold text-slate-900">
                      Courier Partner: <span className="font-black text-indigo-700">{invoiceOrder.courier || 'Steadfast Courier'}</span>
                    </p>
                    <p className="font-mono text-slate-700 mt-0.5">
                      Tracking Code: <strong>{invoiceOrder.trackingCode || 'Pending Booking'}</strong>
                    </p>
                    <p className="text-slate-700 mt-0.5">
                      Order Status: <span className="font-bold uppercase">{invoiceOrder.orderStatus || 'PENDING'}</span>
                    </p>
                  </div>
                </div>

                {/* Items Breakdown Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden print:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200 print:bg-slate-50 print:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">SL</th>
                        <th className="py-2.5 px-4">Item & Variant Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                      {(invoiceOrder.items || []).map((it: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-900">
                            {it.itemTitle || it.title} {it.variantTitle ? `(${it.variantTitle})` : ''}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">{it.quantity || 1}</td>
                          <td className="py-2.5 px-3 text-right font-mono">BDT {Number(it.price || 0).toLocaleString()}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                            BDT {(Number(it.price || 0) * (it.quantity || 1)).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee ({invoiceOrder.city}):</span>
                      <span className="font-mono font-bold">BDT {invoiceOrder.deliveryCharge || 60}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                      <span>Total Payable (COD):</span>
                      <span className="font-mono text-rose-600 font-black text-base print:text-black">
                        BDT {Number(invoiceOrder.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Attributes / Special Instructions */}
                {invoiceOrder.customAttributes && Object.keys(invoiceOrder.customAttributes).length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 block mb-1 uppercase text-[10px]">
                      Order Metafields (Category Tailored):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(invoiceOrder.customAttributes).map(([k, v]: [string, any]) => (
                        <div key={k} className="text-slate-700">
                          <span className="text-slate-400 capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
                          <strong className="text-slate-900">
                            {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature Row */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-800">Authorized Merchant Signature</p>
                    <p className="text-[10px] text-slate-400">{tenantInfo?.name || 'Verified Merchant'}</p>
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-800">Customer Received By & Signature</p>
                    <p className="text-[10px] text-slate-400">Date: ____ / ____ / 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 1: GOOGLE MAPS IP GEOLOCATION PIN */}
        {/* ============================================================== */}
        {mapModalOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-900 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      অর্ডার ডিভাইস ও IP রিয়েল-টাইম লোকেশন
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Order #{mapModalOrder.orderNumber} • IP: {mapModalOrder.clientIp || '103.205.71.42'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMapModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Network, Device & City Summary Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">কাস্টমার</span>
                  <span className="font-extrabold text-slate-900 truncate block">{mapModalOrder.customerName}</span>
                  <span className="font-mono text-[11px] text-slate-600">{mapModalOrder.customerPhone}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">ডিভাইস ও ব্রাউজার</span>
                  <span className="font-extrabold text-slate-900 truncate block">{mapModalOrder.deviceType || 'Mobile'} ({mapModalOrder.os || 'Android'})</span>
                  <span className="text-[11px] text-slate-600">{mapModalOrder.browser || 'Chrome'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">IP লোকেশন</span>
                  <span className="font-extrabold text-indigo-700 truncate block">{mapModalOrder.ipCity || 'Dhaka'}, {mapModalOrder.ipCountry || 'Bangladesh'}</span>
                  <span className="font-mono text-[10px] text-slate-500">{mapModalOrder.ipLatitude || 23.8103}, {mapModalOrder.ipLongitude || 90.4125}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">ডেলিভারি ঠিকানা</span>
                  <span className="font-extrabold text-slate-900 truncate block">{mapModalOrder.city || 'Dhaka'}</span>
                  <span className="text-[11px] text-slate-600 truncate block">{mapModalOrder.shippingAddress}</span>
                </div>
              </div>

              {/* Address Discrepancy Warning Notice */}
              {mapModalOrder.addressDiscrepancy ? (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block font-black text-rose-900">🚨 সতর্কবার্তা: লোকেশন অমিল পাওয়া গেছে!</strong>
                    <span>
                      কাস্টমার যে ডিভাইস থেকে অর্ডার করেছেন তার IP লোকেশন <strong>{mapModalOrder.ipCity}</strong>, কিন্তু পার্সেল পাঠানোর ডেলিভারি ঠিকানা দিয়েছেন <strong>{mapModalOrder.city}</strong>। ডেলিভারি নিশ্চিত করার পূর্বে গ্রাহককে ফোনে কল করুন।
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>লোকেশন ম্যাচ করেছে:</strong> অর্ডারের IP লোকেশন ({mapModalOrder.ipCity}) এবং ডেলিভারি ঠিকানা স্বাভাবিক ও বিশ্বস্ত।
                  </span>
                </div>
              )}

              {/* Embedded Google Maps Pin Iframe */}
              <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-inner h-80 bg-slate-100">
                <iframe
                  title="Customer Geolocation Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${mapModalOrder.ipLatitude || 23.8103},${mapModalOrder.ipLongitude || 90.4125}&z=13&output=embed`}
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapModalOrder.ipLatitude || 23.8103},${mapModalOrder.ipLongitude || 90.4125}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>গুগল ম্যাপস অ্যাপে ওপেন করুন</span>
                </a>
                <button
                  type="button"
                  onClick={() => setMapModalOrder(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: BLOCK / BLACKLIST FAKE CUSTOMER */}
        {/* ============================================================== */}
        {blockModalOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-slate-900 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      কাস্টমার ব্লক / কালো তালিকাভুক্ত করুন
                    </h3>
                    <p className="text-xs text-slate-500">ভুয়া অর্ডার ও রিটার্ন প্রতিরোধ করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => setBlockModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">গ্রাহকের নাম:</span>
                  <strong className="text-slate-900">{blockModalOrder.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">ফোন নম্বর:</span>
                  <strong className="text-rose-700 font-mono font-bold">{blockModalOrder.customerPhone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">ডিভাইস IP:</span>
                  <span className="font-mono text-slate-700">{blockModalOrder.clientIp || '103.205.71.42'}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">ব্লক করার কারণ নির্বাচন করুন:</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="ভুয়া অর্ডার / বারবার পার্সেল বাতিল ও রিটার্ন">ভুয়া অর্ডার / বারবার পার্সেল বাতিল ও রিটার্ন</option>
                  <option value="অকার্যকর বা অন্য কারও ফোন নম্বর প্রদান">অকার্যকর বা অন্য কারও ফোন নম্বর প্রদান</option>
                  <option value="ডেলিভারি রাইডারকে হয়রানি বা অপব্যবহার">ডেলিভারি রাইডারকে হয়রানি বা অপব্যবহার</option>
                  <option value="স্প্যাম বা ক্ষতিকর বট অ্যাক্টিভিটি">স্প্যাম বা ক্ষতিকর বট অ্যাক্টিভিটি</option>
                  <option value="কাস্টমারের অনুরোধে ব্লক করা হয়েছে">কাস্টমারের অনুরোধে ব্লক করা হয়েছে</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                ⚠️ <strong>মনোযোগ দিন:</strong> ব্লক করার পর এই ফোন নম্বর বা IP ব্যবহার করে এই স্টোর বা আপনার যেকোনো স্টোরে চেকআউট করার চেষ্টা করলে সরাসরি <strong>HTTP 403 (অর্ডার প্রত্যাখ্যাত)</strong> বার্তা প্রদর্শিত হবে।
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  disabled={isBlocking}
                  onClick={() => handleBlockCustomer(blockModalOrder)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isBlocking ? 'ব্লক করা হচ্ছে...' : 'নিশ্চিত ব্লক করুন'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: CUSTOMER LIFETIME ORDER HISTORY & FRAUD STATS */}
        {/* ============================================================== */}
        {customerHistoryModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-900 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      গ্রাহকের সম্পূর্ণ লাইফটাইম অর্ডার হিস্ট্রি
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {customerHistoryModal.customerName} • {customerHistoryModal.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomerHistoryModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lifetime Metrics Dashboard */}
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">মোট অর্ডার</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {customerHistoryModal.stats?.totalOrders ?? customerHistoryModal.totalOrders ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-600 block font-bold uppercase">সফল ডেলিভারি</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {customerHistoryModal.stats?.deliveredOrders ?? customerHistoryModal.deliveredOrders ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] text-rose-600 block font-bold uppercase">বাতিল / রিটার্ন</span>
                  <span className="text-lg font-black text-rose-700 font-mono">
                    {customerHistoryModal.stats?.cancelledOrders ?? customerHistoryModal.cancelledOrders ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] text-indigo-600 block font-bold uppercase">ডেলিভারি রেট</span>
                  <span className="text-lg font-black text-indigo-700 font-mono">
                    {customerHistoryModal.stats?.deliverySuccessRate ?? customerHistoryModal.deliverySuccessRate ?? 0}%
                  </span>
                </div>
              </div>

              {/* Status Alert */}
              {customerHistoryModal.isBlocked ? (
                <div className="p-3 rounded-2xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    <strong>এই গ্রাহক বর্তমানে কালো তালিকাভুক্ত (Blocked):</strong> কারণ: {customerHistoryModal.blockReason || 'নিয়মিত পার্সেল বাতিল ও ভুয়া অর্ডার'}
                  </span>
                </div>
              ) : customerHistoryModal.stats?.deliverySuccessRate < 50 && customerHistoryModal.stats?.totalOrders > 1 ? (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>উচ্চ ভুয়া অর্ডার ঝুঁকি (High Risk):</strong> এই গ্রাহক পূর্বে ৫০% এর বেশি অর্ডার বাতিল করেছেন। পার্সেল পাঠানোর পূর্বে অবশ্যই অগ্রিম কুরিয়ার চার্জ গ্রহণ করুন।
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>বিশ্বস্ত গ্রাহক:</strong> সফল ডেলিভারির অনুপাত সন্তোষজনক ({customerHistoryModal.stats?.deliverySuccessRate || 100}%)।
                  </span>
                </div>
              )}

              {/* Past Orders Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">অর্ডারের তালিকা:</span>
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">অর্ডার #</th>
                        <th className="py-2 px-3">তারিখ</th>
                        <th className="py-2 px-3">পণ্য</th>
                        <th className="py-2 px-3 text-right">টাকা</th>
                        <th className="py-2 px-3 text-center">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(customerHistoryModal.orders || []).map((pastOrd: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{pastOrd.orderNumber}</td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {new Date(pastOrd.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 truncate max-w-[150px]">
                            {pastOrd.items?.[0]?.itemTitle || pastOrd.items?.[0]?.title || 'পণ্য'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            BDT {pastOrd.totalAmount?.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                pastOrd.orderStatus === 'DELIVERED' || pastOrd.orderStatus === 'CONFIRMED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : pastOrd.orderStatus === 'CANCELLED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {pastOrd.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {customerHistoryModal.isBlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleUnblockCustomer(customerHistoryModal.phone);
                      setCustomerHistoryModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কাস্টমার আনব্লক করুন</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setBlockModalOrder({
                        customerPhone: customerHistoryModal.phone,
                        customerName: customerHistoryModal.customerName,
                        clientIp: customerHistoryModal.orders?.[0]?.clientIp,
                      });
                      setCustomerHistoryModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                    <span>এই কাস্টমারকে ব্লক করুন</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCustomerHistoryModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: INVENTORY & STOCK MANAGEMENT ENGINE (PHASE 1) */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
          <InventoryManager
            tenantSlug={tenantSlug}
            categories={categories}
            onItemUpdated={refreshCatalogItems}
          />
        )}

        {/* ============================================================== */}
        {/* TAB 2: DYNAMIC PRODUCT & INVENTORY MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {prodNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{prodNotice}</span>
              </div>
            )}

            {/* Unified Products & Media Sub-Navigation Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => setProductSubTab('catalog')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  productSubTab === 'catalog'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-rose-600" />
                <span>Product Catalog ({items.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProductSubTab('media')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  productSubTab === 'media'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Media & Videos Showcase ({mediaItems.length})</span>
              </button>
            </div>

            {/* SUB-TAB 1: PRODUCT CATALOG */}
            {productSubTab === 'catalog' && (
              <div className="space-y-6">
                {/* Top Product Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-600" />
                  <span>Category-Wise Product Management</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700">
                    {items.length} Products
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload and publish products or service offerings dynamically under any store category and brand with custom specifications and variants.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportCatalog}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2"
                  title="Export catalog data as JSON backup"
                >
                  <Database className="w-4 h-4 text-slate-500" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => setShowAddProdModal(!showAddProdModal)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddProdModal ? 'Close Form' : '+ Add New Product'}</span>
                </button>
              </div>
            </div>

            {/* Add Product Collapsible Form */}
            {showAddProdModal && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-rose-500/20 shadow-xl space-y-6 text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>Upload New Product to Category</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select target category, brand, pricing, dynamic specs, and variants to immediately publish to your storefront.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddProdModal(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  {/* Electronics Engineering & Specification Presets Bar */}
                  {(tenantInfo?.businessType === 'electronics' || tenantSlug === 'smartvolt') && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-orange-950 flex items-center gap-1.5 uppercase tracking-wider">
                          <Zap className="w-4 h-4 text-orange-600 fill-orange-600" />
                          <span>1-Click Electronics Engineering Spec & Auto-Fill Presets:</span>
                        </span>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                          Auto Spec Presets
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {[
                          {
                            label: '❄️ Hisense 1.5T Smart Inverter AC',
                            title: 'Hisense Smart Compact AC AS18TW4RGSKB02DU',
                            price: '73900',
                            comparePrice: '75000',
                            badge: '12 Years Compressor Warranty • Dual Inverter',
                            desc: 'Basic Specifications\tAir Conditioner Type\tInverter\nAi Conditioner Function\tCooling\nCooling Capacity (BTU/h)\t18000\nCooling Capacity (W)\t5275\nRated Voltage (V)\t220-240V, 50 Hz\nRated Input Power (W)\t1700\nRated Current (A)\t7.6\nClimate Class\tT1\nEER (W/W)\t3.10\nNoise Level (dB) Indoor\t39\nNoise Level (dB) Outdoor\t54\nRefrigerant\tR32 (0.660kg)\nFin Type\tGolden Hydrophilic Fin\nCompressor Type\tRotary, Dual Inverter\nIndoor Dimensions\t930×300×220 mm\nOutdoor Dimensions\t715×240×540 mm\nWarranty\t12 Years Compressor, 5 Years PCB, 2 Years Free Service',
                            image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
                            specs: [
                              { key: 'Capacity', value: '1.5 Ton (18000 BTU/h)' },
                              { key: 'Compressor', value: 'Dual Inverter T3 Tropical' },
                              { key: 'EER', value: '3.10 W/W (5-Star Saver)' },
                              { key: 'Refrigerant', value: 'Eco-Friendly R32' },
                              { key: 'Warranty', value: '12 Years Compressor, 5 Years PCB' },
                            ],
                            attrs: {
                              appliance_type: 'Air Conditioner (AC)',
                              capacity_spec: '1.5 Ton (18000 BTU)',
                              inverter_tech: 'Dual Inverter Compressor',
                              energy_star_rating: '5-Star Super Saver (Up to 70% Energy Save)',
                              refrigerant_gas: 'Eco-Friendly R32 (Zero ODP)',
                              compressor_motor_warranty: '12 Years Official Warranty',
                              spare_parts_warranty: '5 Years Main Board (PCB), 2 Years Free Service',
                              noise_level_db: '19dB Ultra Quiet Sleep Mode',
                              special_features: ['3D 4-Way Airflow', 'Golden Fin Anti-Rust Coating', '56°C High-Temp Self-Clean', 'WiFi Smart IoT App Control'],
                              power_voltage_rating: '220-240V, 50Hz, 1700W, 7.6A',
                            },
                          },
                          {
                            label: '🧊 Whirlpool 350L Inverter Refrigerator',
                            title: 'Whirlpool 6th Sense Inverter Frost-Free Refrigerator 350L',
                            price: '64500',
                            comparePrice: '69500',
                            badge: '10 Years Compressor Warranty • 6th Sense Deep Freeze',
                            desc: 'Capacity\t350 Liters\nCooling Type\tFrost Free Dual Inverter\nCompressor\tIntelliSense Inverter Technology\nEnergy Star\t5-Star Energy Efficient\nShelves\tToughened Glass Shelves\nDeodorizer\tActive Carbon Fresh Filter\nWarranty\t10 Years Compressor, 2 Years Parts',
                            image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
                            specs: [
                              { key: 'Capacity', value: '350 Liters Frost Free' },
                              { key: 'Compressor', value: 'IntelliSense Dual Inverter' },
                              { key: 'Energy Rating', value: '5-Star Energy Saver' },
                              { key: 'Warranty', value: '10 Years Compressor Warranty' },
                            ],
                            attrs: {
                              appliance_type: 'Refrigerator & Freezer',
                              capacity_spec: '350 Liters',
                              inverter_tech: 'Smart Inverter (T3 Tropical)',
                              energy_star_rating: '5-Star Super Saver (Up to 70% Energy Save)',
                              refrigerant_gas: 'R600a Isobutane',
                              compressor_motor_warranty: '10 Years Official Warranty',
                              spare_parts_warranty: '2 Years Comprehensive Spare Parts',
                              noise_level_db: '36dB Whisper Quiet',
                              special_features: ['6th Sense Deep Freeze', 'Toughened Glass Shelves'],
                              power_voltage_rating: '220-240V / 50Hz, 140W',
                            },
                          },
                          {
                            label: '📺 4K 55" Google Smart TV',
                            title: 'Hisense 55 Inch Frameless 4K UHD Google TV Series',
                            price: '54900',
                            comparePrice: '58000',
                            badge: 'Dolby Atmos Audio • 4 Years Panel Warranty',
                            desc: 'Display Size\t55 Inch UHD 4K\nResolution\t3840 x 2160 Pixels\nOperating System\tGoogle TV OS Licensed\nAudio\tDolby Atmos 24W Stereo Speakers\nHDR\tDolby Vision HDR10+\nWarranty\t4 Years Panel Warranty, 2 Years Motherboard',
                            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
                            specs: [
                              { key: 'Screen Size', value: '55 Inch Frameless 4K UHD' },
                              { key: 'Operating System', value: 'Google TV Certified with Voice Remote' },
                              { key: 'Sound', value: 'Dolby Atmos 24W Studio Sound' },
                              { key: 'Warranty', value: '4 Years Panel Warranty' },
                            ],
                            attrs: {
                              appliance_type: 'Smart TV & Audio',
                              capacity_spec: '55 Inch 4K UHD Frameless',
                              inverter_tech: 'Smart Inverter (T3 Tropical)',
                              energy_star_rating: '4-Star Energy Efficient',
                              compressor_motor_warranty: '3 Years Warranty',
                              spare_parts_warranty: '4 Years Panel Warranty, 2 Years Motherboard',
                              special_features: ['WiFi Smart IoT App Control'],
                              power_voltage_rating: '100-240V, 130W Max',
                            },
                          },
                          {
                            label: '🧺 Toshiba 8.5kg Direct Drive Washer',
                            title: 'Toshiba Real Inverter Direct Drive Washer 8.5kg',
                            price: '48900',
                            comparePrice: '52000',
                            badge: '10 Years Motor Warranty • 90°C Steam Wash',
                            desc: 'Washing Capacity\t8.5 kg\nMotor Type\tReal Inverter BLDC Direct Drive\nWash Temperature\tUp to 90°C Anti-Bacterial Steam\nPrograms\t16 Pre-set Programs (15 Min Quick Wash)\nWarranty\t10 Years Motor, 2 Years Spare Parts',
                            image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
                            specs: [
                              { key: 'Capacity', value: '8.5 kg Front Loading' },
                              { key: 'Motor', value: 'Direct Drive Real Inverter BLDC' },
                              { key: 'Steam Wash', value: '90°C Anti-Allergy Steam' },
                              { key: 'Warranty', value: '10 Years Motor Warranty' },
                            ],
                            attrs: {
                              appliance_type: 'Washing Machine & Dryer',
                              capacity_spec: '8.5 kg Front Loading',
                              inverter_tech: 'Direct Drive Inverter',
                              energy_star_rating: 'Inverter Grade A+++',
                              compressor_motor_warranty: '10 Years Official Warranty',
                              spare_parts_warranty: '2 Years Spare Parts & Free Service',
                              noise_level_db: '52dB Silent Wash',
                              special_features: ['56°C High-Temp Self-Clean', 'WiFi Smart IoT App Control'],
                              power_voltage_rating: '220-240V, 2000W Heater',
                            },
                          },
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setProdTitle(preset.title);
                              setProdPrice(preset.price);
                              setProdComparePrice(preset.comparePrice);
                              setProdBadge(preset.badge);
                              setProdShortDesc(preset.desc);
                              setProdImage(preset.image);
                              setProdSpecs(preset.specs);
                              setProdCustomAttributes(preset.attrs);
                              setProdNotice(`Preset "${preset.label}" successfully loaded!`);
                              setTimeout(() => setProdNotice(null), 3000);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-600 hover:text-white text-slate-800 border border-orange-200 text-xs font-bold transition shadow-sm"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Target Category *</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('categories')}
                          className="text-[11px] text-rose-600 hover:underline"
                        >
                          + New Category
                        </button>
                      </label>
                      <select
                        value={prodCategoryId}
                        onChange={(e) => setProdCategoryId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((c) => (
                          <option key={c.id || c.slug} value={c.id || c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Brand / Manufacturer</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('brands')}
                          className="text-[11px] text-amber-600 hover:underline"
                        >
                          + New Brand
                        </button>
                      </label>
                      <select
                        value={prodBrandId}
                        onChange={(e) => setProdBrandId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      >
                        <option value="">-- Generic / None --</option>
                        {brands.map((b) => (
                          <option key={b.id || b.slug} value={b.id || b.slug}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Item Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Catalog Item Type</label>
                      <select
                        value={prodType}
                        onChange={(e: any) => setProdType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      >
                        <option value="PHYSICAL_PRODUCT">Physical Product (Shipped via Courier)</option>
                        <option value="SERVICE_APPOINTMENT">Service (1-Hour Appointment Booking)</option>
                        <option value="DIGITAL_ITEM">Digital Item (Instant Download)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Product Title */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Product Title / Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vintage Full-Grain Leather Briefcase / Rolex Submariner Date"
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {/* Stock Quantity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Inventory Stock Count</label>
                      <input
                        type="number"
                        min="0"
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Selling Price (BDT / Currency) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 4500"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {/* Compare Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Original / Compare Price (Shows % OFF)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 5200"
                        value={prodComparePrice}
                        onChange={(e) => setProdComparePrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Ribbon Badge and Selectable Variants */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Promotional Ribbon Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. 100% Genuine Full-Grain Leather, Limited Edition"
                        value={prodBadge}
                        onChange={(e) => setProdBadge(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Selectable Variants / Colors / Sizes</label>
                      <input
                        type="text"
                        placeholder="e.g. Vintage Brown, Cognac Tan, Matte Black"
                        value={prodVariants}
                        onChange={(e) => setProdVariants(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                      <span className="text-[11px] text-slate-400">Separate options with commas. Displayed as selectable chips on storefront.</span>
                    </div>
                  </div>

                  {/* Dynamic Category Schema Fields (Auto-Generated UI Builder from Specification) */}
                  {activeCategorySchema && activeCategorySchema.fields?.length > 0 && (
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 border border-indigo-200/80 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                        <div>
                          <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>{activeCategorySchema.name || activeCategorySchema.name_bn} — Dynamic Field Builder ({activeCategorySchema.fields.length} Fields)</span>
                          </span>
                          <p className="text-[11px] text-slate-500 pt-0.5">
                            Configure specifications and filter attributes dynamically tailored for this industry category.
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/70 px-3 py-1 rounded-full border border-indigo-200 w-fit">
                          Order Fulfillment: {activeCategorySchema.orderType}
                        </span>
                      </div>

                      <DynamicFieldRenderer
                        fields={activeCategorySchema.fields}
                        values={prodCustomAttributes}
                        onChange={(key, val) => setProdCustomAttributes((prev) => ({ ...prev, [key]: val }))}
                        lang="bn"
                      />
                    </div>
                  )}

                  {/* Manual / Additional Category Specifications */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-rose-600" />
                          <span>Additional Key-Value Specifications</span>
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Add custom key-value specs displayed as live specification badges on product cards.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setProdSpecs((prev) => [...prev, { key: '', value: '' }])}
                        className="px-3 py-1 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1 w-fit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Spec</span>
                      </button>
                    </div>

                    {/* Quick suggested chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Add:</span>
                      {['Material', 'Warranty', 'Dimensions', 'Origin', 'Hardware', 'Color'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!prodSpecs.some((s) => s.key === chip)) {
                              setProdSpecs((prev) => [...prev, { key: chip, value: '' }]);
                            }
                          }}
                          className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 hover:border-rose-400 hover:text-rose-600 transition"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-2">
                      {prodSpecs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Specification (e.g. Material)"
                            value={spec.key}
                            onChange={(e) => {
                              const updated = [...prodSpecs];
                              updated[sIdx].key = e.target.value;
                              setProdSpecs(updated);
                            }}
                            className="w-1/3 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 100% Genuine Full-Grain Leather)"
                            value={spec.value}
                            onChange={(e) => {
                              const updated = [...prodSpecs];
                              updated[sIdx].value = e.target.value;
                              setProdSpecs(updated);
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                          />
                          <button
                            type="button"
                            onClick={() => setProdSpecs((prev) => prev.filter((_, idx) => idx !== sIdx))}
                            className="p-2 text-slate-400 hover:text-rose-600 transition"
                            title="Remove specification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Image Upload & Gallery */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-rose-600" />
                        <span>Product Images & Media Gallery</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Direct file upload or URL:</span>
                    </label>

                    {/* Direct Upload Button from PC / Mobile */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        id="prod-direct-file-input"
                        className="hidden"
                      />
                      <label
                        htmlFor="prod-direct-file-input"
                        className="cursor-pointer w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span>📁 Upload Image from Device (PC / Phone)</span>
                      </label>

                      <div className="flex-1 w-full flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Or paste direct image URL (https://...)"
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                        />
                        {prodImage && (
                          <button
                            type="button"
                            onClick={() => {
                              if (prodImage.trim()) {
                                setProdImages((prev) => [...prev, prodImage.trim()]);
                                setProdImage('');
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0"
                          >
                            + Add URL
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Gallery Thumbnails Grid */}
                    {prodImages.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                          Selected Product Photos ({prodImages.length}):
                        </span>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {prodImages.map((img, iIdx) => (
                            <div key={iIdx} className="relative group w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm">
                              <img src={img} alt="Product thumb" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(iIdx, false)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow hover:bg-rose-700 transition"
                                title="Remove photo"
                              >
                                ✕
                              </button>
                              {iIdx === 0 && (
                                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-bold text-white text-center py-0.5">
                                  COVER
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 1-Click Sample Presets */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase text-slate-400">1-Click Sample Presets:</span>
                      {[
                        { label: '⌚ Luxury Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
                        { label: '👜 Leather Bag', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80' },
                        { label: '🧥 Leather Jacket', url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80' },
                        { label: '💻 Laptop PC', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' },
                        { label: '💍 Jewelry', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setProdImages((prev) => [...prev, preset.url])}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 transition"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Product Video / Media URL */}
                    <div className="pt-2 border-t border-slate-200/60">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Product Video Review / Demo URL (YouTube / Facebook)</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Optional video embed</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or Facebook reel"
                        value={prodVideoUrl}
                        onChange={(e) => setProdVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Short Specification / Feature Highlight</label>
                    <textarea
                      rows={2}
                      placeholder="Brief 1-2 sentence description displayed on product cards..."
                      value={prodShortDesc}
                      onChange={(e) => setProdShortDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  {/* Featured Checkbox & Submit */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodIsFeatured}
                        onChange={(e) => setProdIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-700">Promote as Featured Item on Storefront Hero</span>
                    </label>

                    <button
                      type="submit"
                      disabled={addingProd}
                      className="px-8 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{addingProd ? 'Publishing Product...' : 'Publish Product to Store'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Filter by Category */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-600 shrink-0">Category Filter:</span>
                <select
                  value={selectedProdCatFilter}
                  onChange={(e) => setSelectedProdCatFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">All Categories ({items.length})</option>
                  {categories.map((c) => {
                    const count = items.filter(
                      (i) => i.categoryId === c.id || i.category?.id === c.id || i.category?.slug === c.slug
                    ).length;
                    return (
                      <option key={c.id || c.slug} value={c.id || c.slug}>
                        {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search by Title */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title..."
                  value={prodSearchQuery}
                  onChange={(e) => setProdSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Products Table / Catalog Grid */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Store Catalog Items ({filteredCatalogItems.length})
                </h4>
                <span className="text-xs text-slate-500">Live in {tenantSlug} storefront</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredCatalogItems.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                    <Package className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-600">No products found under this filter.</p>
                    <p>Click &quot;+ Add New Product&quot; above to upload a product under your desired category.</p>
                  </div>
                ) : (
                  filteredCatalogItems.map((item, idx) => {
                    const itemImg = (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                    const catName = item.category?.name || categories.find((c) => c.id === item.categoryId || c.slug === item.categoryId)?.name || 'General';
                    const brandName = item.brand?.name || brands.find((b) => b.id === item.brandId || b.slug === item.brandId)?.name;

                    return (
                      <div key={item.id || idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                        <div className="flex items-center gap-4">
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-bold text-slate-900">{item.title}</h5>
                              {item.isFeatured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-100">
                                📂 {catName}
                              </span>
                              {brandName && (
                                <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-100">
                                  🏷️ {brandName}
                                </span>
                              )}
                              <span className="text-slate-400 font-mono text-[11px]">
                                Stock: <strong className="text-slate-700">{item.stockQuantity ?? 20}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-slate-900">
                              BDT {item.price?.toLocaleString()}
                            </div>
                            {item.comparePrice && item.comparePrice > item.price && (
                              <div className="text-xs text-slate-400 line-through">
                                BDT {item.comparePrice?.toLocaleString()}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5"
                              title="Edit Product Details & Images"
                            >
                              <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Edit</span>
                            </button>
                            <Link
                              href={`/?tenant=${tenantSlug}`}
                              target="_blank"
                              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                              title="View on Storefront"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.title)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 2: CATEGORY-WISE MEDIA & VIDEO GALLERY (YouTube & Facebook) */}
        {/* ============================================================== */}
        {productSubTab === 'media' && (
          <div className="space-y-6">
            {mediaNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{mediaNotice}</span>
              </div>
            )}

            {/* Media Form Card */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Video & Visual Engagement</span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Category Video & Media Showcase (YouTube, Facebook & Images)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload or embed video reviews, YouTube walk-throughs, Facebook reels, and product images tagged by category.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddMedia} className="space-y-5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Media / Video Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      placeholder="e.g. Handcrafted Leather Briefcase Durability & Water Test"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Assign to Category *
                    </label>
                    <select
                      value={mediaCategoryId}
                      onChange={(e) => setMediaCategoryId(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                    >
                      <option value="all">All Categories (Global Showcase)</option>
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.id || c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Media Platform / Type *
                    </label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                    >
                      <option value="YOUTUBE">YouTube Video</option>
                      <option value="FACEBOOK">Facebook Video / Reel</option>
                      <option value="IMAGE">Product Image Showcase</option>
                      <option value="DIRECT_VIDEO">Direct Video URL (.mp4)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {mediaType === 'YOUTUBE' ? 'YouTube URL (watch / shorts / embed)' : mediaType === 'FACEBOOK' ? 'Facebook Video / Post URL' : 'Image / Direct Media URL'} *
                    </label>
                    <input
                      type="url"
                      required
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder={
                        mediaType === 'YOUTUBE'
                          ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                          : mediaType === 'FACEBOOK'
                          ? 'https://www.facebook.com/watch/?v=...'
                          : 'https://images.unsplash.com/photo-...'
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description / Highlights (Optional)
                  </label>
                  <input
                    type="text"
                    value={mediaDescription}
                    onChange={(e) => setMediaDescription(e.target.value)}
                    placeholder="Short summary of what is shown in this video"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={addingMedia}
                    className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
                  >
                    <Video className="w-4 h-4" />
                    <span>{addingMedia ? 'Publishing Media...' : 'Publish Media to Category'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Category Filter Pills for Media */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setMediaFilterCategory('all')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                  mediaFilterCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                All Categories ({mediaItems.length})
              </button>
              {categories.map((c) => {
                const count = mediaItems.filter(
                  (m) => m.categoryId === c.id || m.categoryId === c.slug
                ).length;
                return (
                  <button
                    key={c.id || c.slug}
                    onClick={() => setMediaFilterCategory(c.id || c.slug)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                      mediaFilterCategory === (c.id || c.slug)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Media Items Grid */}
            {(() => {
              const filteredMedia = mediaItems.filter((m) => {
                if (mediaFilterCategory === 'all') return true;
                return m.categoryId === mediaFilterCategory || m.categoryId === 'all';
              });

              if (filteredMedia.length === 0) {
                return (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                    <Video className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600 text-sm">No media published under this category</p>
                    <p className="mt-1">Use the form above to add YouTube or Facebook videos with titles.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedia.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-slate-950">
                        {m.type === 'YOUTUBE' && m.embedUrl ? (
                          <iframe
                            src={m.embedUrl}
                            title={m.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : m.type === 'FACEBOOK' && m.embedUrl ? (
                          <iframe
                            src={m.embedUrl}
                            title={m.title}
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <img
                            src={m.thumbnail || m.url}
                            alt={m.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span
                          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white shadow-md flex items-center gap-1 ${
                            m.type === 'YOUTUBE'
                              ? 'bg-red-600'
                              : m.type === 'FACEBOOK'
                              ? 'bg-blue-600'
                              : 'bg-emerald-600'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>{m.type}</span>
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            {m.categoryName || 'Category Showcase'}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-2 leading-snug">
                            {m.title}
                          </h4>
                          {m.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {m.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => handleDeleteMedia(m.id, m.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Remove Media"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: EDIT PRODUCT DETAILS & IMAGES */}
        {/* ============================================================== */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Edit Product: {editForm.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update pricing, upload images from your device, specs, and category attributes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditProduct} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                  />
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={editForm.categoryId}
                      onChange={(e) => handleEditCategoryChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.id || c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Brand / Manufacturer
                    </label>
                    <select
                      value={editForm.brandId}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, brandId: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">No Brand Selected</option>
                      {brands.map((b) => (
                        <option key={b.id || b.slug} value={b.id || b.slug}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price, Compare Price, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Price (BDT) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Compare Price (BDT)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editForm.comparePrice}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, comparePrice: e.target.value }))}
                      placeholder="e.g. 5999"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={editForm.stockQuantity}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, stockQuantity: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Badge & Item Type & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Badge (e.g. HOT DEAL, 20% OFF)
                    </label>
                    <input
                      type="text"
                      value={editForm.badge}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, badge: e.target.value }))}
                      placeholder="HOT DEAL"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Product Type
                    </label>
                    <select
                      value={editForm.itemType}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, itemType: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="PHYSICAL_PRODUCT">Physical Product</option>
                      <option value="SERVICE_APPOINTMENT">Service Appointment</option>
                      <option value="DIGITAL_SUBSCRIPTION">Digital / Download</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={Boolean(editForm.isFeatured)}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <label htmlFor="edit-featured" className="text-xs font-bold text-slate-800 cursor-pointer">
                      ★ Mark as Featured
                    </label>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.shortDescription}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Brief overview of features, warranty, and craftsmanship..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* DIRECT DEVICE IMAGE UPLOAD & GALLERY FOR EDIT */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-rose-600" />
                      <span>Product Photos & Media Gallery</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Direct file upload or URL:</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, true)}
                      id="edit-prod-direct-file-input"
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-prod-direct-file-input"
                      className="cursor-pointer w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>📁 Upload Image from Device (PC / Phone)</span>
                    </label>

                    <div className="flex-1 w-full flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                      {editImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            if (editImageUrl.trim()) {
                              setEditForm((prev: any) => ({
                                ...prev,
                                images: [...(prev.images || []), editImageUrl.trim()],
                              }));
                              setEditImageUrl('');
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0"
                        >
                          + Add URL
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Edit Form Image Thumbnails Grid */}
                  {editForm.images && editForm.images.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                        Product Photos ({editForm.images.length}):
                      </span>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {editForm.images.map((img: string, iIdx: number) => (
                          <div key={iIdx} className="relative group w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm">
                            <img src={img} alt="Product thumb" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(iIdx, true)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow hover:bg-rose-700 transition"
                              title="Remove photo"
                            >
                              ✕
                            </button>
                            {iIdx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-bold text-white text-center py-0.5">
                                COVER
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Review URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Video Review / Walk-Through URL (YouTube or Facebook)
                  </label>
                  <input
                    type="url"
                    value={editForm.videoUrl || ''}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Dynamic Category Specifications if Schema Exists */}
                {editSchema && editSchema.fields && editSchema.fields.length > 0 && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                        Dynamic Category Specifications ({editSchema.categoryName || 'Category Schema'})
                      </h5>
                    </div>
                    <DynamicFieldRenderer
                      fields={editSchema.fields}
                      values={editForm.customAttributes || {}}
                      onChange={(fieldKey, val) =>
                        setEditForm((prev: any) => ({
                          ...prev,
                          customAttributes: {
                            ...(prev.customAttributes || {}),
                            [fieldKey]: val,
                          },
                        }))
                      }
                      lang="bn"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editingSaving}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {editingSaving ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )}

        {/* ============================================================== */}
        {/* TAB 2: CATEGORY MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {catNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{catNotice}</span>
              </div>
            )}

            {/* Add Category Form */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <span>Add New Category to Store</span>
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Leather Bags, Chronographs..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Campaign Slogan / Promotional Ribbon (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Genuine Full-Grain Leather & Handcrafted Goods - Flat 15% Festive Discount"
                      value={newCatPromoSlogan}
                      onChange={(e) => setNewCatPromoSlogan(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="submit"
                    disabled={addingCat}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{addingCat ? 'Adding Category...' : 'Add Category'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Categories Table */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Active Store Categories ({categories.length})</h4>
                <span className="text-xs text-slate-500">Stored in {dbInfo?.dbName || `tenant_${tenantSlug}`}</span>
              </div>

              <div className="divide-y divide-slate-100">
                {categories.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No custom categories added yet. Add your first category using the form above.
                  </div>
                ) : (
                  categories.map((cat, idx) => {
                    const count = items.filter(
                      (i) => i.categoryId === cat.id || i.category?.id === cat.id || i.category?.slug === cat.slug
                    ).length;

                    return (
                      <div key={cat.id || idx} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">
                                {count} {count === 1 ? 'Product' : 'Products'}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">slug: {cat.slug}</span>
                            {cat.promoSlogan && (
                              <p className="text-[11px] text-rose-600 font-medium mt-0.5 flex items-center gap-1">
                                <span>🏷️ Campaign Slogan: {cat.promoSlogan}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setProdCategoryId(cat.id || cat.slug);
                              setActiveTab('products');
                              setShowAddProdModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5"
                            title="Upload product directly to this category"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Upload Product Here</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProdCatFilter(cat.id || cat.slug);
                              setActiveTab('products');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                            title="View all products under this category"
                          >
                            <Filter className="w-3.5 h-3.5" />
                            <span>View Items</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: BRAND MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            {brandNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{brandNotice}</span>
              </div>
            )}

            {/* Add Brand Form */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Add New Brand to Store</span>
              </h3>
              <form onSubmit={handleAddBrand} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Brand Name (e.g. Apple, Rolex, Walton, Samsung)"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="url"
                  placeholder="Logo Image URL (Optional)"
                  value={newBrandLogo}
                  onChange={(e) => setNewBrandLogo(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={addingBrand}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingBrand ? 'Saving Brand...' : 'Save Brand'}</span>
                </button>
              </form>
            </div>

            {/* Brands Grid */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Registered Brands ({brands.length})</h4>
                <span className="text-xs text-slate-500">Linked to products & filters</span>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-xs text-slate-400">
                    No brands registered yet. Add your brand partners above.
                  </div>
                ) : (
                  brands.map((brand, idx) => (
                    <div
                      key={brand.id || idx}
                      className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                            {brand.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{brand.name}</h5>
                          <span className="text-[11px] font-mono text-slate-400">slug: {brand.slug}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteBrand(brand.id, brand.name)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Brand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: STORE SETTINGS & BRANDING */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {settingsNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settingsNotice}</span>
              </div>
            )}

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <span>Store Branding & Profile Configuration</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Update your public business name, contact lines, address, and live promotional slogans.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Store / Business Name</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Official Helpline Phone</label>
                    <input
                      type="text"
                      placeholder="+880 1700-000000"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Customer Support Email</label>
                    <input
                      type="email"
                      placeholder="support@yourdomain.com"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Physical Store / Office Address</label>
                    <input
                      type="text"
                      placeholder="Plot 12, Block D, Banani, Dhaka"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Top Announcement Banner Text</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400">Displayed in red ribbon bar at the top of the storefront.</span>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? 'Saving Changes...' : 'Save Store Settings'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: 1-HOUR APPOINTMENTS SHEET */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm print:hidden">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>Daily 1-Hour Appointment Manifest</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select a date to generate or print the doctor / clinic physical consultation queue.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={selectedSheetDate}
                  onChange={(e) => setSelectedSheetDate(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Daily Sheet</span>
                </button>
              </div>
            </div>

            {/* Printable Daily Sheet Manifest */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{tenantInfo?.name || 'Clinic Management'}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consultation Manifest for Date: <strong className="text-slate-800">{selectedSheetDate}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Total Patients: {sheetData.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Serial #</th>
                      <th className="py-3 px-4">Patient / Client Name</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Assigned 1-Hour Slot</th>
                      <th className="py-3 px-4">Requested Service / Treatment</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheetData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-black text-slate-900">#{row.serialNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.customerName}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{row.customerPhone}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{row.bookingTime}</td>
                        <td className="py-3.5 px-4 text-slate-600">{row.item?.title || 'General Consultation'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: STORE MODULES */}
        {/* ============================================================== */}
        {activeTab === 'modules' && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Installed Store Modules</h3>
              <p className="text-xs text-slate-500 mt-1">
                Toggle features on and off for this store. Enabled modules automatically inject into your storefront.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">1-Hour Slot Booking Engine</h4>
                  <p className="text-xs text-slate-500">Allows visitors to select a calendar date and reserved 1-hour time slot.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Enabled</span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">72-Hour Consumer Dispute Redressal</h4>
                  <p className="text-xs text-slate-500">Provides customers with public dispute filing and refund claims.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Enabled</span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Verified Product Reviews & Ratings</h4>
                  <p className="text-xs text-slate-500">Enables customer feedback collection and 5-star rating badges.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: ELECTRONICS SHOWROOMS & SERVICE OUTLETS MANAGER */}
        {/* ============================================================== */}
        {activeTab === 'showrooms' && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-700 uppercase tracking-wider">
                    Retail & Service Network
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                    Hotline: 09606 111 777
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span>Authorized Showrooms & Customer Service Outlet Network</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Manage physical showrooms, flagship experience zones, and official service points nationwide.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddShowroomModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Showroom</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total Outlets</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{showroomsList.length} Active Branches</div>
                <span className="text-[10px] text-emerald-600 font-bold">Nationwide Active</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Covered Cities</span>
                <div className="text-2xl font-black text-slate-900 mt-1">4 Divisional Cities</div>
                <span className="text-[10px] text-slate-400">Dhaka, Chattogram, Sylhet, Khulna</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Central Drooto Helpline</span>
                <div className="text-lg font-black text-orange-600 mt-1">09606 111 777</div>
                <span className="text-[10px] text-emerald-600 font-bold">24/7 Dedicated Support</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Field Technicians</span>
                <div className="text-2xl font-black text-slate-900 mt-1">24 Certified</div>
                <span className="text-[10px] text-blue-600 font-bold">Doorstep AC/Appliance Setup</span>
              </div>
            </div>

            {/* Outlets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showroomsList.map((showroom) => (
                <div
                  key={showroom.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 text-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-100 text-orange-700">
                      {showroom.city}
                    </span>
                    <button
                      onClick={() => {
                        setShowroomsList((prev) => prev.filter((s) => s.id !== showroom.id));
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {showroom.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{showroom.address}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Hotline:</span>
                      <span className="font-bold text-slate-900">{showroom.phone}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>In-Charge / Manager:</span>
                      <span className="font-semibold text-slate-800">{showroom.manager}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Operating Hours:</span>
                      <span className="text-slate-700">{showroom.hours}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Showroom Open
                    </span>
                    <a
                      href={`tel:09606111777`}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Showroom Modal */}
            {showAddShowroomModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span>Add New Showroom or Service Hub</span>
                    </h4>
                    <button
                      onClick={() => setShowAddShowroomModal(false)}
                      className="text-slate-400 hover:text-slate-600 font-bold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newShowroomName.trim() || !newShowroomAddress.trim()) return;
                      const newObj = {
                        id: `shw_${Date.now()}`,
                        city: newShowroomCity,
                        name: newShowroomName.trim(),
                        address: newShowroomAddress.trim(),
                        phone: newShowroomPhone.trim(),
                        manager: newShowroomManager.trim() || 'Store Manager',
                        hours: newShowroomHours.trim(),
                        isActive: true,
                      };
                      setShowroomsList((prev) => [newObj, ...prev]);
                      setNewShowroomName('');
                      setNewShowroomAddress('');
                      setShowAddShowroomModal(false);
                      setProdNotice('New showroom successfully added!');
                      setTimeout(() => setProdNotice(null), 3000);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Division or City *</label>
                      <select
                        value={newShowroomCity}
                        onChange={(e) => setNewShowroomCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      >
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chattogram</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Bogura">Bogura</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Showroom Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mirpur Experience Center"
                        value={newShowroomName}
                        onChange={(e) => setNewShowroomName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="Plot, Road, Area, Landmark"
                        value={newShowroomAddress}
                        onChange={(e) => setNewShowroomAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Hotline / Phone</label>
                        <input
                          type="text"
                          value={newShowroomPhone}
                          onChange={(e) => setNewShowroomPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">In-Charge / Manager</label>
                        <input
                          type="text"
                          placeholder="Manager Name"
                          value={newShowroomManager}
                          onChange={(e) => setNewShowroomManager(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
                      <input
                        type="text"
                        value={newShowroomHours}
                        onChange={(e) => setNewShowroomHours(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddShowroomModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md"
                      >
                        Save Showroom
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

export default function TenantAdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-500">Loading Merchant Portal...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
