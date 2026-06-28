import TripSection from "@/components/TripSection";
import { wildlifeTrips } from "@/data/trips";
import { Binoculars, Camera, TreePine } from "lucide-react";
import { motion } from "framer-motion";

const Wildlife = () => {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-hero text-white py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Binoculars className="h-16 w-16 mx-auto mb-6 text-white/80" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Wildlife Encounters
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            Get up close with nature's most magnificent creatures. Experience the thrill 
            of wildlife spotting in their natural habitats.
          </p>
        </div>
      </motion.section>

      {/* Wildlife Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-muted"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 bg-card rounded-lg shadow-soft"
            >
              <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Photography Safaris</h3>
              <p className="text-muted-foreground">
                Capture stunning wildlife moments with expert photography guidance.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 bg-card rounded-lg shadow-soft"
            >
              <TreePine className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Conservation Focus</h3>
              <p className="text-muted-foreground">
                Learn about wildlife conservation while supporting local communities.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 bg-card rounded-lg shadow-soft"
            >
              <Binoculars className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Naturalists</h3>
              <p className="text-muted-foreground">
                Experienced guides who know animal behavior and best spotting locations.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Conservation Message */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 bg-green-50 border-l-4 border-green-400"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <TreePine className="h-8 w-8 text-green-600 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Responsible Wildlife Tourism
              </h3>
              <p className="text-green-700">
                We are committed to ethical wildlife tourism that contributes to conservation 
                efforts and supports local communities. Our trips follow strict guidelines 
                to ensure minimal impact on wildlife and their habitats.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* All Wildlife Trips */}
      <TripSection
        title="Wildlife Adventures"
        subtitle="Discover incredible wildlife experiences in pristine natural habitats"
        trips={wildlifeTrips}
        showFilters={true}
        maxDisplay={50}
      />

      {/* Coming Soon */}
      {wildlifeTrips.length === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 text-center"
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Binoculars className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">More Wildlife Adventures Coming Soon</h3>
            <p className="text-muted-foreground mb-6">
              We're currently curating amazing wildlife experiences. Check back soon or 
              contact us for custom wildlife tour requests.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Contact for Custom Tours
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Wildlife;