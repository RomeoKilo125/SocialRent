const Campaign = require('../models/campaign');
const Business = require('../models/business');

// CRUD methods for campaignController
module.exports = {
  // Get all campaigns
  findAll: function(req, res) {
    Campaign.find({})
    // Sort campaigns by ending soon to just posted
      .populate('businessId').sort({endDate: -1}).then(campaign => res.json(campaign)).catch(err => res.status(422).json(err))
  },
  // Get a specific campaign
  findById: function(req, res) {
    Campaign.findById(req.params.id).then(campaign => res.json(campaign)).catch(err => res.status(422).json(err))
  },
  // Business creates a campaign
  create: function(req, res) {
    req.body.url = req.body.url.replace(/https?:\/\//gi,'')
    Campaign.create(req.body).then((dbCampaign) => {
      // Push newly created campaign into business collection.  (Needs to be tested)
      Business.findOneAndUpdate({
        _id: dbCampaign.businessId
      }, {
        $push: {
          campaigns: dbCampaign._id
        }
      }, {new: true}).populate('campaigns').then(updatedBusiness => {
        res.json(updatedBusiness)
      })
    }).catch(err => res.status(422).json(err))
  },
  // Update a campaign
  update: function(req, res) {
    Campaign.findOneAndUpdate({
      _id: req.params.id
    }, req.body).then(campaign => res.json(campaign)).catch(err => res.status(422).json(err))
  },
  // Delete a campaign
  remove: function(req, res) {
    Campaign.findById({_id: req.params.id}).then(campaign => campaign.remove()).then(campaign => res.json(campaign)).catch(err => res.status(422).json(err))
  }
}
