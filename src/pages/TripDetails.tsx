import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { tripService, bookingService, Trip, ItineraryDay, FAQ } from "@/lib/dataService";
import { TextProcessor } from "@/lib/textProcessor";
import { filterValidDates } from "@/utils/dateUtils";
import { TripSEO } from "@/components/TripSEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { MobileImageGallery } from "@/components/MobileImageGallery";
import { TouchButton } from "@/components/TouchButton";

interface AmazonReview {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  review_images?: string[];
  youtube_link?: string;
  created_at: string;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  image_url?: string;
  created_at: string;
}
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertCircle,
  Shield,
  FileText,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Trip>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [reviews, setReviews] = useState<AmazonReview[]>([]);
  
  // Section-specific editing states
  const [editingSections, setEditingSections] = useState({
    overview: false,
    itinerary: false,
    inclusions: false,
    essentials: false,
    transport: false,
    policy: false,
    cancellation: false,
    refund: false,
    hero: false,
    pricing: false,
    details: false,
    'things-to-remember': false
  });
  
  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Mobile gallery state
  const [showMobileGallery, setShowMobileGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Comprehensive edit data
  const [tempEditData, setTempEditData] = useState({
    title: '',
    category: '',
    base_price: 0,
    duration: '',
    difficulty: '',
    overview_content: '',
    transportation: '',
    cancellation_policy: '',
    inclusions: [] as string[],
    exclusions: [] as string[],
    essentials: [] as string[],
    newInclusion: '',
    newExclusion: '',
    newEssential: '',
    thingsToRememberSections: [] as Array<{header: string, points: string[]}>
  });

  // Bulk text processing state for inclusions
  const [bulkText, setBulkText] = useState('');
  const [showBulkProcessor, setShowBulkProcessor] = useState(false);
  const [processedItems, setProcessedItems] = useState<string[]>([]);

  // Bulk text processing state for exclusions
  const [bulkTextExclusions, setBulkTextExclusions] = useState('');
  const [showBulkProcessorExclusions, setShowBulkProcessorExclusions] = useState(false);
  const [processedItemsExclusions, setProcessedItemsExclusions] = useState<string[]>([]);

  // Bulk text processing state for cancellation policy
  const [bulkTextCancellation, setBulkTextCancellation] = useState('');
  const [showBulkProcessorCancellation, setShowBulkProcessorCancellation] = useState(false);

  // Bulk text processing state for refund policy
  const [bulkTextRefund, setBulkTextRefund] = useState('');
  const [showBulkProcessorRefund, setShowBulkProcessorRefund] = useState(false);

  // Bulk text processing state for things to remember
  const [bulkTextThings, setBulkTextThings] = useState('');
  const [showBulkProcessorThings, setShowBulkProcessorThings] = useState(false);

  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const updateTempData = (field: string, value: any) => {
    setTempEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadReviews = async (tripId: string) => {
    try {
      const data = await tripService.getReviews(tripId);
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadTrip = async () => {
    if (!tripId) return;
    
    try {
      setLoading(true);
      
      // Load current trip
      const tripData = await tripService.getBySlugOrId(tripId);
      
      if (tripData) {
        setTrip(tripData);
        setEditData(tripData);
        
        console.log('🔍 Loaded trip data:', tripData);
        console.log('📝 Things to remember:', tripData.things_to_remember);
        
        // Load reviews for this trip
        await loadReviews(tripData.id);
        
        // Initialize temp edit data
        setTempEditData({
          title: tripData.title || '',
          category: tripData.category || '',
          base_price: tripData.base_price || 0,
          duration: tripData.duration || '',
          difficulty: tripData.difficulty || '',
          overview_content: tripData.overview_content || tripData.short_desc || '',
          transportation: tripData.transportation || '',
          cancellation_policy: tripData.cancellation_policy || '',
          inclusions: tripData.inclusions || [],
          exclusions: tripData.exclusions || [],
          essentials: tripData.essentials || [],
          newInclusion: '',
          newExclusion: '',
          newEssential: ''
        });
      } else {
        toast({
          title: "Trip Not Found",
          description: "The requested trip could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to load trip:', error);
      toast({
        title: "Error",
        description: "Failed to load trip details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render star ratings
  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Helper function to calculate rating summary
  const calculateRatingSummary = () => {
    if (reviews.length === 0) return { average: 0, breakdown: [0, 0, 0, 0, 0] };
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    
    const breakdown = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      breakdown[review.rating - 1]++;
    });
    
    return { average, breakdown };
  };

  // Helper function to format review date
  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to parse things_to_remember data
  const parseThingsToRemember = (data: any) => {
    if (!data) return [];
    
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch {
            return { header: 'Important Notes', points: [item] };
          }
        }
        return item;
      });
    }
    
    return [];
  };

  const handleSaveEdit = async () => {
    if (!trip || !tripId) return;
    
    try {
      // Prepare update data from both tempEditData and editData
      const updateData: Partial<Trip> = {};
      
      // Handle hero section edits (from tempEditData)
      if (tempEditData.title && tempEditData.title !== trip.title) {
        updateData.title = tempEditData.title;
      }
      if (tempEditData.category && tempEditData.category !== trip.category) {
        updateData.category = tempEditData.category;
      }
      if (tempEditData.base_price && tempEditData.base_price !== trip.base_price) {
        updateData.base_price = tempEditData.base_price;
      }
      if (tempEditData.duration && tempEditData.duration !== trip.duration) {
        updateData.duration = tempEditData.duration;
      }
      if (tempEditData.difficulty && tempEditData.difficulty !== trip.difficulty) {
        updateData.difficulty = tempEditData.difficulty;
      }
      if (tempEditData.location && tempEditData.location !== trip.location) {
        updateData.location = tempEditData.location;
      }
      
      // Handle section edits (from editData)
      if (editData.overview_content && editData.overview_content !== trip.overview_content) {
        updateData.overview_content = editData.overview_content;
        updateData.short_desc = editData.overview_content; // Also update short_desc
      }
      if (editData.difficulty && editData.difficulty !== trip.difficulty) {
        updateData.difficulty = editData.difficulty;
      }
      if (editData.duration && editData.duration !== trip.duration) {
        updateData.duration = editData.duration;
      }
      if (editData.category && editData.category !== trip.category) {
        updateData.category = editData.category;
      }
      if (editData.itinerary && JSON.stringify(editData.itinerary) !== JSON.stringify(trip.itinerary)) {
        updateData.itinerary = editData.itinerary;
      }
      if (editData.cancellation_policy && editData.cancellation_policy !== trip.cancellation_policy) {
        updateData.cancellation_policy = editData.cancellation_policy;
      }
      if (editData.refund_policy && editData.refund_policy !== trip.refund_policy) {
        updateData.refund_policy = editData.refund_policy;
      }
      if (editData.transportation && editData.transportation !== trip.transportation) {
        updateData.transportation = editData.transportation;
      }
      if (editData.things_to_remember && editData.things_to_remember !== trip.things_to_remember) {
        updateData.things_to_remember = editData.things_to_remember;
      }
      
      // Handle inclusions and exclusions from tempEditData
      if (tempEditData.inclusions && tempEditData.inclusions.length > 0) {
        updateData.inclusions = tempEditData.inclusions;
      }
      if (tempEditData.exclusions && tempEditData.exclusions.length > 0) {
        updateData.exclusions = tempEditData.exclusions;
      }
      if (tempEditData.essentials && tempEditData.essentials.length > 0) {
        updateData.essentials = tempEditData.essentials;
      }
      if (tempEditData.thingsToRememberSections && tempEditData.thingsToRememberSections.length > 0) {
        updateData.things_to_remember = tempEditData.thingsToRememberSections;
        console.log('💾 Saving things_to_remember:', tempEditData.thingsToRememberSections);
      }
      
      console.log('📤 Update data being sent to Supabase:', updateData);
      
      // Save to Supabase database
      try {
        // Use trip.id (actual ID) instead of tripId (which is slug)
        const updatedTrip = await tripService.update(trip.id, updateData);
        console.log('✅ Successfully saved to Supabase:', updatedTrip);
        
        // Update the trip state with the returned data
        if (updatedTrip.data) {
          console.log('🔄 Updating trip state with:', updatedTrip.data);
          setTrip(updatedTrip.data);
          setEditData(updatedTrip.data);
        } else if (updatedTrip && !updatedTrip.error) {
          // Handle case where updatedTrip is the data directly
          console.log('🔄 Updating trip state with (direct):', updatedTrip);
          setTrip(updatedTrip);
          setEditData(updatedTrip);
        }
        
        // Turn off editing mode to show the saved data
        setEditingSections(prev => ({
          ...prev,
          itinerary: false,
          overview: false,
          inclusions: false,
          essentials: false,
          'things-to-remember': false,
          policy: false,
          cancellation: false
        }));
        
        toast({
          title: "Success",
          description: "Changes saved successfully!",
        });
      } catch (error) {
        console.error('❌ Supabase save error:', error);
        toast({
          title: "Error",
          description: `Failed to save: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      // Reset editing states
      setIsEditing(false);
      setEditData({});
      setTempEditData({
        title: '',
        category: '',
        base_price: 0,
        duration: '',
        difficulty: '',
        overview_content: '',
        transportation: '',
        cancellation_policy: '',
        inclusions: [] as string[],
        exclusions: [] as string[],
        essentials: [] as string[],
        newInclusion: '',
        newExclusion: '',
        newEssential: '',
        thingsToRememberSections: [] as Array<{header: string, points: string[]}>
      });
      setEditingSections({
        overview: false,
        itinerary: false,
        inclusions: false,
        essentials: false,
        transport: false,
        policy: false,
        cancellation: false,
        refund: false,
        hero: false,
        pricing: false,
        details: false
      });
      
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
      
    } catch (error) {
      console.error('Error saving edits:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const updateItineraryDay = (dayIndex: number, field: string, value: any) => {
    setEditData(prev => {
      const currentItinerary = prev.itinerary || trip?.itinerary || [];
      const updatedItinerary = [...currentItinerary];
      
      if (!updatedItinerary[dayIndex]) {
        updatedItinerary[dayIndex] = { day: dayIndex + 1, title: '', description: '', activities: [] };
      }
      
      updatedItinerary[dayIndex] = {
        ...updatedItinerary[dayIndex],
        [field]: value
      };
      
      return {
        ...prev,
        itinerary: updatedItinerary
      };
    });
  };

  const addItineraryDay = () => {
    console.log('Adding itinerary day...'); // Debug log
    
    // First ensure we're in edit mode
    if (!editingSections.itinerary) {
      setEditingSections(prev => ({ ...prev, itinerary: true }));
    }
    
    setEditData(prev => {
      const currentItinerary = prev.itinerary || trip?.itinerary || [];
      const newDay = {
        day: currentItinerary.length + 1,
        title: `Day ${currentItinerary.length + 1}`,
        description: '',
        activities: []
      };
      
      const updatedItinerary = [...currentItinerary, newDay];
      console.log('New itinerary:', updatedItinerary); // Debug log
      
      return {
        ...prev,
        itinerary: updatedItinerary
      };
    });
    
    // Show success message
    toast({
      title: "Day Added",
      description: `Day ${(editData.itinerary?.length || 0) + 1} has been added to the itinerary.`,
    });
  };

  const removeItineraryDay = (dayIndex: number) => {
    setEditData(prev => {
      const currentItinerary = prev.itinerary || trip?.itinerary || [];
      const updatedItinerary = currentItinerary.filter((_, index) => index !== dayIndex);
      
      // Renumber days
      const renumberedItinerary = updatedItinerary.map((day, index) => ({
        ...day,
        day: index + 1
      }));
      
      return {
        ...prev,
        itinerary: renumberedItinerary
      };
    });
  };

  const toggleSectionEdit = (section: keyof typeof editingSections) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Initialize editData with current trip content when entering edit mode
    if (!editingSections[section] && trip) {
      if (section === 'overview') {
        setEditData(prev => ({
          ...prev,
          overview_content: trip.overview_content || trip.short_desc || '',
          difficulty: trip.difficulty || 'Moderate',
          duration: trip.duration || '',
          category: trip.category || '',
          group_experience: 'Join like-minded adventurers from around the world'
        }));
      } else if (section === 'itinerary') {
        setEditData(prev => ({
          ...prev,
          itinerary: trip.itinerary || []
        }));
      } else if (section === 'inclusions') {
        setTempEditData(prev => ({
          ...prev,
          inclusions: trip.inclusions || [],
          exclusions: trip.exclusions || [],
          newInclusion: '',
          newExclusion: ''
        }));
      } else if (section === 'essentials') {
        setTempEditData(prev => ({
          ...prev,
          essentials: trip.essentials || [],
          newEssential: ''
        }));
      } else if (section === 'cancellation') {
        setEditData(prev => ({
          ...prev,
          cancellation_policy: trip.cancellation_policy || ''
        }));
      } else if (section === 'refund') {
        setEditData(prev => ({
          ...prev,
          refund_policy: trip.refund_policy || ''
        }));
      } else if (section === 'things-to-remember') {
        // Initialize with existing data or create default structure
        const existingData = trip.things_to_remember;
        let sectionsData = [];
        
        if (Array.isArray(existingData)) {
          // Handle array of objects (correct format)
          sectionsData = existingData.map(item => {
            if (typeof item === 'string') {
              // Parse stringified JSON
              try {
                return JSON.parse(item);
              } catch {
                return { header: 'Important Notes', points: [item] };
              }
            }
            return item;
          });
        } else if (typeof existingData === 'string' && existingData.trim()) {
          // Convert old string format to new structure
          sectionsData = [{
            header: 'Important Notes',
            points: existingData.split('\n').filter(line => line.trim())
          }];
        } else {
          // Create default sections
          sectionsData = [
            { header: 'Packing Essentials', points: [] },
            { header: 'Safety Guidelines', points: [] }
          ];
        }
        
        console.log('🔧 Parsed things_to_remember sections:', sectionsData);
        
        setTempEditData(prev => ({
          ...prev,
          thingsToRememberSections: sectionsData
        }));
      }
    }
  };

  const addToList = (listType: 'inclusions' | 'exclusions' | 'essentials') => {
    const newItemKey = `new${listType.charAt(0).toUpperCase() + listType.slice(1, -1)}` as keyof typeof tempEditData;
    const newItem = tempEditData[newItemKey] as string;
    
    if (newItem.trim()) {
      setTempEditData(prev => ({
        ...prev,
        [listType]: [...prev[listType], newItem.trim()],
        [newItemKey]: ''
      }));
    }
  };

  const removeFromList = (listType: 'inclusions' | 'exclusions' | 'essentials', index: number) => {
    setTempEditData(prev => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index)
    }));
  };

  // Bulk text processing functions for inclusions
  const processBulkText = () => {
    const result = TextProcessor.processText(bulkText);
    setProcessedItems(result.items);
  };

  const addBulkItems = () => {
    const currentInclusions = tempEditData.inclusions || [];
    setTempEditData(prev => ({
      ...prev,
      inclusions: [...currentInclusions, ...processedItems]
    }));
    setBulkText('');
    setProcessedItems([]);
    setShowBulkProcessor(false);
  };

  const removeBulkItem = (index: number) => {
    setProcessedItems(processedItems.filter((_, i) => i !== index));
  };

  // Bulk text processing functions for exclusions
  const processBulkTextExclusions = () => {
    const result = TextProcessor.processText(bulkTextExclusions);
    setProcessedItemsExclusions(result.items);
  };

  const addBulkItemsExclusions = () => {
    const currentExclusions = tempEditData.exclusions || [];
    setTempEditData(prev => ({
      ...prev,
      exclusions: [...currentExclusions, ...processedItemsExclusions]
    }));
    setBulkTextExclusions('');
    setProcessedItemsExclusions([]);
    setShowBulkProcessorExclusions(false);
  };

  const removeBulkItemExclusions = (index: number) => {
    setProcessedItemsExclusions(processedItemsExclusions.filter((_, i) => i !== index));
  };

  // Bulk text processing functions for cancellation policy
  const processBulkTextCancellation = () => {
    const result = TextProcessor.processText(bulkTextCancellation);
    const formattedText = result.items.join('\n\n');
    setEditData(prev => ({
      ...prev,
      cancellation_policy: (prev.cancellation_policy || '') + (prev.cancellation_policy ? '\n\n' : '') + formattedText
    }));
    setBulkTextCancellation('');
    setShowBulkProcessorCancellation(false);
  };

  // Bulk text processing functions for refund policy
  const processBulkTextRefund = () => {
    const result = TextProcessor.processText(bulkTextRefund);
    const formattedText = result.items.join('\n\n');
    setEditData(prev => ({
      ...prev,
      refund_policy: (prev.refund_policy || '') + (prev.refund_policy ? '\n\n' : '') + formattedText
    }));
    setBulkTextRefund('');
    setShowBulkProcessorRefund(false);
  };

  // Bulk text processing functions for things to remember
  const processBulkTextThings = () => {
    const result = TextProcessor.processText(bulkTextThings);
    const currentSections = tempEditData.thingsToRememberSections || [];
    
    // Create a new section with the processed items
    const newSection = {
      header: 'Important Notes',
      points: result.items
    };
    
    setTempEditData(prev => ({
      ...prev,
      thingsToRememberSections: [...currentSections, newSection]
    }));
    
    setBulkTextThings('');
    setShowBulkProcessorThings(false);
  };

  // Things to Remember helper functions
  const addThingsSection = () => {
    const currentSections = tempEditData.thingsToRememberSections || [];
    setTempEditData({
      ...tempEditData,
      thingsToRememberSections: [
        ...currentSections,
        { header: '', points: [] }
      ]
    });
  };

  const removeThingsSection = (sectionIndex: number) => {
    const currentSections = tempEditData.thingsToRememberSections || [];
    const updatedSections = currentSections.filter((_, i) => i !== sectionIndex);
    setTempEditData({
      ...tempEditData,
      thingsToRememberSections: updatedSections
    });
  };

  const updateThingsSection = (sectionIndex: number, field: 'header', value: string) => {
    const currentSections = [...(tempEditData.thingsToRememberSections || [])];
    currentSections[sectionIndex] = {
      ...currentSections[sectionIndex],
      [field]: value
    };
    setTempEditData({
      ...tempEditData,
      thingsToRememberSections: currentSections
    });
  };

  const addThingsPoint = (sectionIndex: number, point: string) => {
    const currentSections = [...(tempEditData.thingsToRememberSections || [])];
    const currentPoints = currentSections[sectionIndex]?.points || [];
    currentSections[sectionIndex] = {
      ...currentSections[sectionIndex],
      points: [...currentPoints, point]
    };
    setTempEditData({
      ...tempEditData,
      thingsToRememberSections: currentSections
    });
  };

  const removeThingsPoint = (sectionIndex: number, pointIndex: number) => {
    const currentSections = [...(tempEditData.thingsToRememberSections || [])];
    const currentPoints = currentSections[sectionIndex]?.points || [];
    currentSections[sectionIndex] = {
      ...currentSections[sectionIndex],
      points: currentPoints.filter((_, i) => i !== pointIndex)
    };
    setTempEditData({
      ...tempEditData,
      thingsToRememberSections: currentSections
    });
  };

  const updateThingsPoint = (sectionIndex: number, pointIndex: number, value: string) => {
    const currentSections = [...(tempEditData.thingsToRememberSections || [])];
    const currentPoints = [...(currentSections[sectionIndex]?.points || [])];
    currentPoints[pointIndex] = value;
    currentSections[sectionIndex] = {
      ...currentSections[sectionIndex],
      points: currentPoints
    };
    setTempEditData({
      ...tempEditData,
      thingsToRememberSections: currentSections
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !trip) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error", 
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    
    try {
      console.log('🔄 Uploading image to server for trip:', trip.id);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api-php/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const publicUrl = result.url;

      console.log('✅ Image uploaded successfully:', publicUrl);

      // Update trip with new image URL in database
      const { data: updatedTrip, error: updateError } = await tripService.update(trip.id, {
        image_url: publicUrl
      });

      if (updateError) throw updateError;

      // Update UI immediately
      setTrip(prev => prev ? { ...prev, image_url: publicUrl } : null);
      
      toast({
        title: "Success",
        description: "Image uploaded and saved successfully!",
      });
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('❌ Image upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Not Found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Get consistent image (same logic as other pages)
  const getConsistentImage = () => {
    // Priority: database image_url → placeholder
    if (trip.image_url) return trip.image_url;
    return "/hero-image.jpg"; // Placeholder
  };

  const mainImage = getConsistentImage();

  return (
    <div className="min-h-screen bg-background">
      {trip && <TripSEO trip={trip} url={`https://trekatour.in/trip/${trip.slug || trip.id}`} />}
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-orange-600">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/trips')} className="hover:text-orange-600">{trip.category}</button>
            <span>/</span>
            <span className="text-gray-900">{trip.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <section className="relative">
        <div 
          className="relative h-[60vh] overflow-hidden cursor-pointer md:cursor-default"
          onClick={() => {
            // On mobile, open gallery
            if (window.innerWidth < 768) {
              setGalleryImages([mainImage]);
              setShowMobileGallery(true);
            }
          }}
        >
          <OptimizedImage
            src={mainImage}
            alt={trip.title}
            className="w-full h-full"
            priority={true}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Mobile Gallery Indicator */}
          <div className="absolute bottom-4 right-4 md:hidden">
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <span>Tap to view</span>
            </div>
          </div>

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <TouchButton
              variant="primary"
              size="sm"
              onClick={() => navigate(-1)}
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
              haptic="medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </TouchButton>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploadingImage}
              />
              
              {/* Change Image Button */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
                disabled={isUploadingImage}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploadingImage ? 'Uploading...' : 'Change Image'}
              </Button>
              {!isEditing ? (
                <Button
                  onClick={() => {
                    setIsEditing(true);
                    // Initialize tempEditData with current trip data
                    setTempEditData({
                      title: trip.title,
                      category: trip.category,
                      base_price: trip.base_price,
                      duration: trip.duration,
                      difficulty: trip.difficulty,
                      location: trip.location,
                    });
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Trip
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 backdrop-blur-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setTempEditData({});
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Trip Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="text-white mb-4 md:mb-0">
                  <Badge className="bg-orange-600 text-white mb-2">
                    {isEditing ? (
                      <Input
                        value={tempEditData.category || trip.category || ''}
                        onChange={(e) => updateTempData('category', e.target.value)}
                        className="bg-white/20 border-white/30 text-white w-32"
                      />
                    ) : (
                      trip.category
                    )}
                  </Badge>
                  
                  {isEditing ? (
                    <Input
                      value={tempEditData.title || trip.title || ''}
                      onChange={(e) => updateTempData('title', e.target.value)}
                      className="text-3xl md:text-5xl font-bold bg-white/20 border-white/30 text-white mb-2 w-full"
                    />
                  ) : (
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">
                      {trip.title}
                    </h1>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm md:text-base">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {isEditing ? (
                        <Input
                          value={tempEditData.duration || trip.duration || ''}
                          onChange={(e) => updateTempData('duration', e.target.value)}
                          className="bg-white/20 border-white/30 text-white w-32"
                        />
                      ) : (
                        trip.duration
                      )}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      {isEditing ? (
                        <select
                          value={tempEditData.difficulty || trip.difficulty || ''}
                          onChange={(e) => updateTempData('difficulty', e.target.value)}
                          className="bg-white/20 border-white/30 text-white rounded px-2 py-1"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                        >
                          <option value="Easy" style={{ backgroundColor: '#1f2937', color: 'white' }}>Easy</option>
                          <option value="Moderate" style={{ backgroundColor: '#1f2937', color: 'white' }}>Moderate</option>
                          <option value="Challenging" style={{ backgroundColor: '#1f2937', color: 'white' }}>Challenging</option>
                          <option value="Expert" style={{ backgroundColor: '#1f2937', color: 'white' }}>Expert</option>
                        </select>
                      ) : (
                        trip.difficulty || 'Moderate'
                      )}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {isEditing ? (
                        <Input
                          value={tempEditData.location || trip.location || ''}
                          onChange={(e) => updateTempData('location', e.target.value)}
                          className="bg-white/20 border-white/30 text-white w-40"
                        />
                      ) : (
                        trip.location
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-white text-right">
                  {/* Show original price with strikethrough if available */}
                  {!isEditing && trip.original_price && trip.original_price > trip.base_price && (
                    <div className="text-lg opacity-75 line-through mb-1">
                      ₹{trip.original_price.toLocaleString()}
                    </div>
                  )}
                  <div className="text-3xl md:text-4xl font-bold">
                    ₹{isEditing ? (
                      <Input
                        type="number"
                        value={tempEditData.base_price || trip.base_price || 0}
                        onChange={(e) => updateTempData('base_price', parseInt(e.target.value))}
                        className="bg-white/20 border-white/30 text-white w-32 inline-block ml-1"
                      />
                    ) : (
                      (trip.base_price || 0).toLocaleString()
                    )}
                  </div>
                  <div className="text-sm opacity-90">per person</div>
                  {/* Show discount percentage if applicable */}
                  {!isEditing && trip.original_price && trip.original_price > trip.base_price && (
                    <div className="mt-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {Math.round(((trip.original_price - trip.base_price) / trip.original_price) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Content Area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full h-auto p-1 bg-muted rounded-lg overflow-x-auto flex lg:grid lg:grid-cols-5 gap-1">
                  <TabsTrigger value="overview" className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary" className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions" className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Inclusions</TabsTrigger>
                  <TabsTrigger value="policy" className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Policy</TabsTrigger>
                  <TabsTrigger value="things-to-remember" className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Things to Remember</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Trip Overview
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleSectionEdit('overview')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.overview ? 'Cancel Edit' : 'Edit Content'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.overview ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Trip Description</Label>
                            <Textarea
                              value={editData.overview_content || editData.short_desc || ''}
                              onChange={(e) => setEditData({...editData, overview_content: e.target.value})}
                              rows={6}
                              className="mt-2"
                              placeholder="Enter detailed trip description..."
                            />
                          </div>
                          <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-lg border-l-4 border-orange-500 mb-6">
                            <h3 className="text-lg font-semibold text-orange-800 mb-3">About This Adventure</h3>
                            <div className="text-gray-700 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                              {trip.overview_content || trip.short_desc || 'No description available yet.'}
                            </div>
                          </div>
                          
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Amazon-Style Customer Reviews Section - Only show if reviews exist */}
                  {reviews.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">Customer Reviews</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Rating Summary */}
                          <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1">
                                  {renderStars(Math.round(calculateRatingSummary().average), "w-5 h-5")}
                                </div>
                                <span className="text-lg font-medium">
                                  {calculateRatingSummary().average.toFixed(1)} out of 5 stars
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{reviews.length} global ratings</p>
                            </div>
                            
                            {/* Rating Breakdown */}
                            <div className="flex-1 space-y-2">
                              {[5, 4, 3, 2, 1].map((star) => {
                                const count = calculateRatingSummary().breakdown[star - 1];
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                return (
                                  <div key={star} className="flex items-center gap-2 text-sm">
                                    <span className="w-6">{star}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-yellow-400 h-2 rounded-full" 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="w-8 text-right">{percentage.toFixed(0)}%</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Individual Reviews */}
                          <div className="space-y-6">
                            {reviews.map((review) => (
                              <div key={review.id} className="border-b pb-6 last:border-b-0">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {review.user_name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{review.user_name}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                      </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-3">
                                      Reviewed on {formatReviewDate(review.created_at)}
                                    </p>
                                    
                                    <p className="text-gray-800 leading-relaxed mb-3">
                                      {review.review_text}
                                    </p>
                                    
                                    {review.review_images && review.review_images.length > 0 && (
                                      <div className="flex gap-2 mb-3">
                                        {review.review_images.map((imageUrl, index) => (
                                          <img 
                                            key={index}
                                            src={imageUrl} 
                                            alt={`Review image ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                                            onClick={() => window.open('https://www.instagram.com/trekatour/', '_blank')}
                                          />
                                        ))}
                                      </div>
                                    )}
                                    
                                    {review.youtube_link && (
                                      <div className="mb-3">
                                        <a 
                                          href={review.youtube_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 hover:underline"
                                        >
                                          📺 Watch on YouTube
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                          Day-wise Itinerary
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleSectionEdit('itinerary')}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              {editingSections.itinerary ? 'Close Edit' : 'Edit'}
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.itinerary ? (
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <h4 className="font-medium text-blue-800 mb-2">Itinerary Editor</h4>
                            <p className="text-blue-700 text-sm">Edit day-wise itinerary details below. Click Save Changes when done.</p>
                          </div>
                          
                          {(editData.itinerary && editData.itinerary.length > 0) || (trip.itinerary && trip.itinerary.length > 0) ? (
                            <div className="space-y-4">
                              {(editData.itinerary || trip.itinerary || []).map((day, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <Label>Day Number</Label>
                                      <Input
                                        type="number"
                                        value={editData.itinerary?.[index]?.day || day.day}
                                        onChange={(e) => updateItineraryDay(index, 'day', parseInt(e.target.value))}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label>Day Title</Label>
                                      <Input
                                        value={editData.itinerary?.[index]?.title || day.title}
                                        onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                                        className="mt-1"
                                        placeholder="e.g., Arrival & Check-in"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mb-4">
                                    <Label>Day Description</Label>
                                    <Textarea
                                      value={editData.itinerary?.[index]?.description || day.description}
                                      onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                                      rows={3}
                                      className="mt-1"
                                      placeholder="Describe the day's activities and schedule..."
                                    />
                                  </div>
                                  
                                  <div className="mb-4">
                                    <Label>Activities (one per line)</Label>
                                    <Textarea
                                      value={editData.itinerary?.[index]?.activities?.join('\n') || day.activities?.join('\n') || ''}
                                      onChange={(e) => updateItineraryDay(index, 'activities', e.target.value.split('\n').filter(a => a.trim()))}
                                      rows={3}
                                      className="mt-1"
                                      placeholder="Activity 1&#10;Activity 2&#10;Activity 3"
                                    />
                                  </div>
                                  
                                  <Button
                                    onClick={() => removeItineraryDay(index)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove Day
                                  </Button>
                                </div>
                              ))}
                              
                              <Button
                                onClick={addItineraryDay}
                                variant="outline"
                                className="w-full border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Day
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Yet</h3>
                              <p className="text-gray-500 mb-4">Start by adding the first day of your trip.</p>
                              <Button
                                onClick={addItineraryDay}
                                variant="outline"
                                className="border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Day
                              </Button>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-4 border-t">
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button onClick={() => toggleSectionEdit('itinerary')} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {trip.itinerary && trip.itinerary.length > 0 ? (
                        <div className="space-y-6">
                          {trip.itinerary.map((day, index) => (
                            <div key={index} className="relative">
                              {/* Timeline connector */}
                              {index < trip.itinerary!.length - 1 && (
                                <div className="absolute left-6 top-12 w-0.5 h-full bg-orange-200 -z-10"></div>
                              )}
                              
                              <div className="flex items-start space-x-4">
                                {/* Day number circle */}
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                                  {day.day}
                                </div>
                                
                                {/* Day content */}
                                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-gray-900">{day.title}</h3>
                                    {isAdmin && isEditing && (
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="ghost">
                                          <Edit3 className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-600">
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-wrap">{day.description}</p>
                                  
                                  {/* Activities */}
                                  {day.activities && day.activities.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                        <Star className="w-4 h-4 mr-2 text-orange-500" />
                                        Activities
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {day.activities.map((activity, i) => (
                                          <div key={i} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                            {activity}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Meals and Accommodation */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {day.meals && day.meals.length > 0 && (
                                      <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Meals Included:</h4>
                                        <div className="flex flex-wrap gap-1">
                                          {day.meals.map((meal, i) => (
                                            <Badge key={i} variant="secondary" className="bg-green-100 text-green-700">
                                              {meal}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {day.accommodation && (
                                      <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Accommodation:</h4>
                                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                          {day.accommodation}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Available</h3>
                          <p className="text-gray-500 mb-4">The detailed day-wise itinerary will be shared upon booking confirmation.</p>
                          {isAdmin && (
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => {
                                toggleSectionEdit('itinerary');
                                addItineraryDay();
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Itinerary
                            </Button>
                          )}
                        </div>
                      )}
                      </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Inclusions Tab */}
                <TabsContent value="inclusions" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* What's Included */}
                    <Card className="border-green-200">
                      <CardHeader className="bg-green-50">
                        <CardTitle className="text-green-800 flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            What's Included
                          </div>
                          {isAdmin && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-300"
                              onClick={() => toggleSectionEdit('inclusions')}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              {editingSections.inclusions ? 'Save' : 'Edit'}
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {editingSections.inclusions ? (
                          <div className="space-y-4">
                            {/* Inclusions Editor Only */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium">Edit Inclusions</h4>
                                <Button
                                  onClick={() => setShowBulkProcessor(!showBulkProcessor)}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  Bulk Add
                                </Button>
                              </div>

                              {/* Bulk Text Processor */}
                              {showBulkProcessor && (
                                <Card className="mb-4 border-blue-200 bg-blue-50">
                                  <CardContent className="p-4">
                                    <Label className="text-sm font-medium">Paste text from PDF</Label>
                                    <Textarea
                                      placeholder="Paste your inclusions text here... (supports bullets, numbers, or line-by-line)"
                                      value={bulkText}
                                      onChange={(e) => setBulkText(e.target.value)}
                                      className="mt-2 min-h-[100px]"
                                    />
                                    <div className="flex gap-2 mt-3">
                                      <Button onClick={processBulkText} size="sm" disabled={!bulkText.trim()}>
                                        <Eye className="w-4 h-4 mr-1" />
                                        Preview
                                      </Button>
                                      <Button onClick={() => setShowBulkProcessor(false)} size="sm" variant="outline">
                                        Cancel
                                      </Button>
                                    </div>

                                    {/* Preview processed items */}
                                    {processedItems.length > 0 && (
                                      <div className="mt-4 p-3 bg-white rounded border">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-sm font-medium text-green-600">
                                            Found {processedItems.length} inclusions
                                          </span>
                                          <Button onClick={addBulkItems} size="sm" className="bg-green-600 hover:bg-green-700">
                                            Add All
                                          </Button>
                                        </div>
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                          {processedItems.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                              <span className="text-green-500">✓</span>
                                              <span className="flex-1">{item}</span>
                                              <Button
                                                onClick={() => removeBulkItem(index)}
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0"
                                              >
                                                <X className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )}

                              {tempEditData.inclusions.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                  <Input value={item} readOnly className="flex-1" />
                                  <Button 
                                    onClick={() => removeFromList('inclusions', index)} 
                                    size="sm" 
                                    variant="destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add inclusion..."
                                  value={tempEditData.newInclusion}
                                  onChange={(e) => updateTempData('newInclusion', e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      addToList('inclusions');
                                    }
                                  }}
                                />
                                <Button onClick={() => addToList('inclusions')} size="sm">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        ) : (
                          <>
                            {(trip.inclusions && trip.inclusions.length > 0) ? (
                          <div className="space-y-3">
                            {trip.inclusions.map((item, index) => (
                              <div key={index} className="flex items-start group">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <span className="text-gray-700">{item}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500 mb-4">No inclusions listed yet</p>
                            {isAdmin && (
                              <Button 
                                onClick={() => toggleSectionEdit('inclusions')}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Inclusions
                              </Button>
                            )}
                          </div>
                        )}
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* What's Not Included */}
                  <Card className="border-red-200">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-red-800 flex items-center justify-between">
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 mr-2" />
                          What's Not Included
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-300"
                            onClick={() => toggleSectionEdit('exclusions')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.exclusions ? 'Save' : 'Edit'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {editingSections.exclusions ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Edit Exclusions</h4>
                            <Button
                              onClick={() => setShowBulkProcessorExclusions(!showBulkProcessorExclusions)}
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Bulk Add
                            </Button>
                          </div>

                          {/* Bulk Text Processor for Exclusions */}
                          {showBulkProcessorExclusions && (
                            <Card className="mb-4 border-red-200 bg-red-50">
                              <CardContent className="p-4">
                                <Label className="text-sm font-medium">Paste text from PDF</Label>
                                <Textarea
                                  placeholder="Paste your exclusions text here... (supports bullets, numbers, or line-by-line)"
                                  value={bulkTextExclusions}
                                  onChange={(e) => setBulkTextExclusions(e.target.value)}
                                  className="mt-2 min-h-[100px]"
                                />
                                <div className="flex gap-2 mt-3">
                                  <Button onClick={processBulkTextExclusions} size="sm" disabled={!bulkTextExclusions.trim()}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    Preview
                                  </Button>
                                  <Button onClick={() => setShowBulkProcessorExclusions(false)} size="sm" variant="outline">
                                    Cancel
                                  </Button>
                                </div>

                                {/* Preview processed items */}
                                {processedItemsExclusions.length > 0 && (
                                  <div className="mt-4 p-3 bg-white rounded border">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-red-600">
                                        Found {processedItemsExclusions.length} exclusions
                                      </span>
                                      <Button onClick={addBulkItemsExclusions} size="sm" className="bg-red-600 hover:bg-red-700">
                                        Add All
                                      </Button>
                                    </div>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                      {processedItemsExclusions.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                          <span className="text-red-500">✗</span>
                                          <span className="flex-1">{item}</span>
                                          <Button
                                            onClick={() => removeBulkItemExclusions(index)}
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                          >
                                            <X className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {tempEditData.exclusions.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <Input value={item} readOnly className="flex-1" />
                              <Button 
                                onClick={() => removeFromList('exclusions', index)} 
                                size="sm" 
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add exclusion..."
                              value={tempEditData.newExclusion}
                              onChange={(e) => updateTempData('newExclusion', e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addToList('exclusions');
                                }
                              }}
                            />
                            <Button onClick={() => addToList('exclusions')} size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button onClick={handleSaveEdit} className="bg-red-600 hover:bg-red-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <>
                          {(trip.exclusions && trip.exclusions.length > 0) ? (
                            <div className="space-y-3">
                              {trip.exclusions.map((item, index) => (
                                <div key={index} className="flex items-start group">
                                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="text-gray-700">{item}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-500 mb-4">No exclusions listed yet</p>
                              {isAdmin && (
                                <Button 
                                  onClick={() => toggleSectionEdit('exclusions')}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Exclusions
                                </Button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                  </div>

                  {/* Important Notes */}
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-yellow-900 font-bold text-sm">!</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
                          <p className="text-yellow-700 text-sm">
                            Please review the inclusions and exclusions carefully before booking. 
                            For any clarifications, feel free to contact our team.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Policy Tab */}
                <TabsContent value="policy" className="space-y-6">
                  
                  {/* Cancellation Policy */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 mr-2 text-red-600" />
                          Cancellation Policy
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleSectionEdit('cancellation')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.cancellation ? 'Cancel Edit' : 'Edit'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.cancellation ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Cancellation Policy Content</Label>
                              <Button
                                onClick={() => setShowBulkProcessorCancellation(!showBulkProcessorCancellation)}
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Bulk Add
                              </Button>
                            </div>

                            {/* Bulk Text Processor for Cancellation Policy */}
                            {showBulkProcessorCancellation && (
                              <Card className="mb-4 border-orange-200 bg-orange-50">
                                <CardContent className="p-4">
                                  <Label className="text-sm font-medium">Paste policy text from PDF</Label>
                                  <Textarea
                                    placeholder="Paste your cancellation policy text here..."
                                    value={bulkTextCancellation}
                                    onChange={(e) => setBulkTextCancellation(e.target.value)}
                                    className="mt-2 min-h-[100px]"
                                  />
                                  <div className="flex gap-2 mt-3">
                                    <Button onClick={processBulkTextCancellation} size="sm" disabled={!bulkTextCancellation.trim()}>
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add to Policy
                                    </Button>
                                    <Button onClick={() => setShowBulkProcessorCancellation(false)} size="sm" variant="outline">
                                      Cancel
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            <Textarea
                              value={editData.cancellation_policy || trip.cancellation_policy || ''}
                              onChange={(e) => setEditData({...editData, cancellation_policy: e.target.value})}
                              rows={6}
                              className="mt-2"
                              placeholder="Enter cancellation policy details, timelines, and fees..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button onClick={() => toggleSectionEdit('cancellation')} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          {trip.cancellation_policy ? (
                            <div className="whitespace-pre-wrap text-gray-700">
                              {trip.cancellation_policy}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-500 mb-4">No cancellation policy available</p>
                              {isAdmin && (
                                <Button 
                                  onClick={() => toggleSectionEdit('cancellation')}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Cancellation Policy
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Refund Policy */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                          Refund Policy
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleSectionEdit('refund')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.refund ? 'Cancel Edit' : 'Edit'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.refund ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Refund Policy Content</Label>
                              <Button
                                onClick={() => setShowBulkProcessorRefund(!showBulkProcessorRefund)}
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Bulk Add
                              </Button>
                            </div>

                            {/* Bulk Text Processor for Refund Policy */}
                            {showBulkProcessorRefund && (
                              <Card className="mb-4 border-green-200 bg-green-50">
                                <CardContent className="p-4">
                                  <Label className="text-sm font-medium">Paste policy text from PDF</Label>
                                  <Textarea
                                    placeholder="Paste your refund policy text here..."
                                    value={bulkTextRefund}
                                    onChange={(e) => setBulkTextRefund(e.target.value)}
                                    className="mt-2 min-h-[100px]"
                                  />
                                  <div className="flex gap-2 mt-3">
                                    <Button onClick={processBulkTextRefund} size="sm" disabled={!bulkTextRefund.trim()}>
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add to Policy
                                    </Button>
                                    <Button onClick={() => setShowBulkProcessorRefund(false)} size="sm" variant="outline">
                                      Cancel
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            <Textarea
                              value={editData.refund_policy || trip.refund_policy || ''}
                              onChange={(e) => setEditData({...editData, refund_policy: e.target.value})}
                              rows={6}
                              className="mt-2"
                              placeholder="Enter refund policy details, process, and conditions..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button onClick={() => toggleSectionEdit('refund')} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          {trip.refund_policy ? (
                            <div className="whitespace-pre-wrap text-gray-700">
                              {trip.refund_policy}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-500 mb-4">No refund policy available</p>
                              {isAdmin && (
                                <Button 
                                  onClick={() => toggleSectionEdit('refund')}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Refund Policy
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Transportation Tab */}
                <TabsContent value="things-to-remember" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                          Things to Remember
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Just toggle edit mode - save is handled by separate Save button
                              toggleSectionEdit('things-to-remember');
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections['things-to-remember'] ? 'Save Changes' : 'Edit'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections['things-to-remember'] ? (
                        <div className="space-y-6">
                          {/* Edit Mode - Header + Points Structure */}
                          {tempEditData.thingsToRememberSections?.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-2 mb-3">
                                <Input
                                  value={section.header || ''}
                                  onChange={(e) => updateThingsSection(sectionIndex, 'header', e.target.value)}
                                  placeholder="Section header (e.g., Packing Essentials)"
                                  className="font-medium"
                                />
                                <Button
                                  onClick={() => removeThingsSection(sectionIndex)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              {/* Points under this header */}
                              <div className="space-y-2 ml-4">
                                {section.points?.map((point, pointIndex) => (
                                  <div key={pointIndex} className="flex items-center gap-2">
                                    <span className="text-orange-600">•</span>
                                    <Input
                                      value={point || ''}
                                      onChange={(e) => updateThingsPoint(sectionIndex, pointIndex, e.target.value)}
                                      placeholder="Add point..."
                                      className="flex-1"
                                    />
                                    <Button
                                      onClick={() => removeThingsPoint(sectionIndex, pointIndex)}
                                      size="sm"
                                      variant="outline"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                
                                {/* Add new point */}
                                <div className="flex items-center gap-2">
                                  <span className="text-orange-600">•</span>
                                  <Input
                                    placeholder="Add new point..."
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        addThingsPoint(sectionIndex, e.currentTarget.value.trim());
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                  <Button
                                    onClick={(e) => {
                                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                      if (input.value.trim()) {
                                        addThingsPoint(sectionIndex, input.value.trim());
                                        input.value = '';
                                      }
                                    }}
                                    size="sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Bulk Text Processor for Things to Remember */}
                          <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm font-medium">Bulk Add Section</Label>
                                <Button
                                  onClick={() => setShowBulkProcessorThings(!showBulkProcessorThings)}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  {showBulkProcessorThings ? 'Hide' : 'Bulk Add'}
                                </Button>
                              </div>

                              {showBulkProcessorThings && (
                                <div className="space-y-3">
                                  <Textarea
                                    placeholder="Paste your things to remember text here... (will create a new section with bullet points)"
                                    value={bulkTextThings}
                                    onChange={(e) => setBulkTextThings(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                  <div className="flex gap-2">
                                    <Button onClick={processBulkTextThings} size="sm" disabled={!bulkTextThings.trim()}>
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add as New Section
                                    </Button>
                                    <Button onClick={() => setShowBulkProcessorThings(false)} size="sm" variant="outline">
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          
                          {/* Add new section */}
                          <Button
                            onClick={addThingsSection}
                            variant="outline"
                            className="w-full border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Section
                          </Button>
                          
                          {/* Save Changes Button */}
                          <div className="flex gap-2 pt-4 border-t">
                            <Button 
                              onClick={() => {
                                console.log('🔄 Save Changes clicked for things-to-remember');
                                console.log('📝 Current tempEditData.thingsToRememberSections:', tempEditData.thingsToRememberSections);
                                handleSaveEdit();
                              }} 
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button onClick={() => toggleSectionEdit('things-to-remember')} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {parseThingsToRemember(trip.things_to_remember).length > 0 ? (
                            <div className="space-y-6">
                              {parseThingsToRemember(trip.things_to_remember).map((section, index) => (
                                <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                                    <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                                    {section.header}
                                  </h4>
                                  <ul className="space-y-2 ml-4">
                                    {section.points?.map((point, pointIndex) => (
                                      <li key={pointIndex} className="flex items-start">
                                        <span className="text-orange-600 mr-2 mt-1">•</span>
                                        <span className="text-gray-700">{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No Important Notes Available</h3>
                              <p className="text-gray-500 mb-4">Important things to remember will be added here.</p>
                              {isAdmin && (
                                <Button 
                                  onClick={() => toggleSectionEdit('things-to-remember')}
                                  variant="outline"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Things to Remember
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book This Trip</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    {/* Show original price with strikethrough if available */}
                    {trip.original_price && trip.original_price > trip.base_price && (
                      <div className="text-lg text-gray-400 line-through mb-1">
                        ₹{trip.original_price.toLocaleString()}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-orange-600">
                      ₹{(trip.base_price || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                    {/* Show discount percentage if applicable */}
                    {trip.original_price && trip.original_price > trip.base_price && (
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          {Math.round(((trip.original_price - trip.base_price) / trip.original_price) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      {trip.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      Group Trip
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-gray-500" />
                      {trip.difficulty || 'Moderate'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {(() => {
                        const validDates = filterValidDates(trip.available_dates || []);
                        if (validDates.length > 0) {
                          return validDates.length === 1 
                            ? `Available: ${validDates[0]}`
                            : `${validDates.length} dates available`;
                        }
                        return "Available on request";
                      })()}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate(`/booking/${tripId}`)}
                    className="w-full text-white font-semibold py-3 orange-book-button"
                    size="lg"
                  >
                    Book Now
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500 space-y-1">
                    <p>✓ Instant confirmation</p>
                    <p>✓ Best price guarantee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
      </section>

      {/* Mobile Image Gallery */}
      {showMobileGallery && (
        <div className="fixed inset-0 z-50 bg-black">
          <MobileImageGallery
            images={galleryImages}
            initialIndex={0}
            onClose={() => setShowMobileGallery(false)}
          />
        </div>
      )}
    </div>
  );
};

export default TripDetails;
