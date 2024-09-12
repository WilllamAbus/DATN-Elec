'use strict';
const apiServices = require('../../../services/services/api-service');

const ServiceController = {
    // Create a new service
    createService: async (req, res) => {
        try {
            const serviceData = req.body;
            const newService = await apiServices.createService(serviceData);
            res.status(201).json(newService);
        } catch (error) {
            console.error('Error creating service:', error.message);
            res.status(400).json({ error: error.message });
        }
    },

    // Get all services
    getAllServices: async (req, res) => {
        try {
            const services = await apiServices.getAllServices();
            res.status(200).json({ data: services });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a service by ID
    getServiceById: async (req, res) => {
        try {
            const service = await apiServices.getServiceById(req.params.id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.status(200).json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a service by ID
    updateService: async (req, res) => {
        try {
            const service = await apiServices.updateService(req.params.id, req.body);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.status(200).json(service);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete a service by ID
    deleteService: async (req, res) => {
        try {
            const service = await apiServices.deleteService(req.params.id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.status(200).json({ message: 'Service deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Soft delete a service by ID
    softDeleteService: async (req, res) => {
        try {
            const id = req.params.id;
            const softDeletedService = await apiServices.softDeleteService(id);
            if (!softDeletedService) {
                return res.status(404).json({ message: 'Service not found' });
            }
            res.status(200).json({ message: 'Service soft deleted successfully', data: softDeletedService });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get a list of soft-deleted services
    getDeletedServices: async (req, res) => {
        try {
            const deletedServices = await apiServices.getDeletedServices();
            res.status(200).json({ data: deletedServices });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Restore a soft-deleted service by ID
    restoreService: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Missing service ID' });
            }
            const restoredService = await apiServices.restoreService(id);
            if (!restoredService) {
                return res.status(404).json({ message: 'Service not found' });
            }
            res.status(200).json({ message: 'Service restored successfully', data: restoredService });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = ServiceController;
