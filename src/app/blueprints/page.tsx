'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, Eye, Download, Grid, List, X, ExternalLink } from 'lucide-react';

interface Blueprint {
  name: string;
  slug: string;
  type: string;
  preview_url: string;
  screenshot_url: string;
  resources_url: string;
}



const BlueprintsBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewBlueprint, setPreviewBlueprint] = useState<Blueprint | null>(null);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const response = await fetch('https://patterns.hiive.cloud/api/v1/blueprints');
        const data = await response.json();
        
        console.log('API Response:', data); // Debug log to see actual structure
        
        let allBlueprints: Blueprint[] = [];
        
        // Handle different possible response structures
        if (Array.isArray(data)) {
          // If data is directly an array
          allBlueprints = data;
        } else if (data && typeof data === 'object') {
          // If data is an object with categories
          if (data.businesses && Array.isArray(data.businesses)) {
            allBlueprints.push(...data.businesses);
          }
          if (data.ecommerce && Array.isArray(data.ecommerce)) {
            allBlueprints.push(...data.ecommerce);
          }
          if (data.personal && Array.isArray(data.personal)) {
            allBlueprints.push(...data.personal);
          }
          // If data has other potential array properties
          Object.values(data).forEach(value => {
            if (Array.isArray(value)) {
              allBlueprints.push(...value);
            }
          });
        }
        
        setBlueprints(allBlueprints);
        setError(null);
      } catch (error: unknown) {
        console.error('Error fetching blueprints:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlueprints();
  }, []);

  // Filter blueprints based on search and type
  const filteredBlueprints = blueprints.filter(blueprint => {
    const matchesSearch = blueprint.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || blueprint.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get unique types for filter
  const types = ['all', ...new Set(blueprints.map(bp => bp.type))];

  // Count blueprints per type
  const getTypeCount = (type: string): number => {
    if (type === 'all') return blueprints.length;
    return blueprints.filter(bp => bp.type === type).length;
  };

  const capitalizeType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const openPreview = (blueprint: Blueprint): void => {
    setPreviewBlueprint(blueprint);
  };

  const closePreview = () => {
    setPreviewBlueprint(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error notification banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto flex items-start">
            <div className="flex-shrink-0">
              <ExternalLink className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-700">
                <strong>Error loading blueprints:</strong> {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewBlueprint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{previewBlueprint.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  previewBlueprint.type === 'business' ? 'bg-blue-100 text-blue-700' :
                  previewBlueprint.type === 'ecommerce' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {capitalizeType(previewBlueprint.type)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewBlueprint.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Open in New Tab
                </a>
                <a
                  href={previewBlueprint.resources_url}
                  className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Download size={14} />
                  Download
                </a>
                <button
                  onClick={closePreview}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Content - Iframe */}
            <div className="flex-1 p-4">
              <iframe
                src={previewBlueprint.preview_url}
                className="w-full h-full border rounded-lg"
                title={`Preview of ${previewBlueprint.name}`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hiive Blueprints</h1>
              <p className="text-gray-600 mt-1">Browse {blueprints.length} website templates</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search blueprints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Filter size={16} />
                  Categories
                </h3>
                <div className="space-y-2">
                  {types.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${
                        selectedType === type
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{capitalizeType(type)}</span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {getTypeCount(type)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredBlueprints.length} of {blueprints.length} blueprints
              </p>
            </div>

            {filteredBlueprints.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No blueprints found matching your criteria</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredBlueprints.map(blueprint => (
                  <div key={blueprint.slug} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-[16/10] bg-gray-100 relative cursor-pointer" onClick={() => openPreview(blueprint)}>
                      <Image
                        src={blueprint.screenshot_url}
                        alt={`Screenshot of ${blueprint.name}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded shadow-sm ${
                          blueprint.type === 'business' ? 'bg-blue-100 text-blue-700' :
                          blueprint.type === 'ecommerce' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {capitalizeType(blueprint.type)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{blueprint.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openPreview(blueprint)}
                          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye size={14} />
                          Full Preview
                        </button>
                        <a
                          href={blueprint.resources_url}
                          className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBlueprints.map(blueprint => (
                  <div key={blueprint.slug} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-40 h-28 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => openPreview(blueprint)}>
                        <Image
                          src={blueprint.screenshot_url}
                          alt={blueprint.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          fill
                          sizes="160px"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{blueprint.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            blueprint.type === 'business' ? 'bg-blue-100 text-blue-700' :
                            blueprint.type === 'ecommerce' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {capitalizeType(blueprint.type)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openPreview(blueprint)}
                          className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye size={14} />
                          Live Preview
                        </button>
                        <a
                          href={blueprint.resources_url}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SinglePage() {
  return <BlueprintsBrowser />;
}