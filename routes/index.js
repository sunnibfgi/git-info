'use strict'

const util = require('util')
const express = require('express')
const request = require('request')
const async = require('async')

const router = express.Router()

let baseUrl = 'https://api.github.com/users',
	userUrl = `${baseUrl}/%s`,
	subUrl = `${baseUrl}/%s/%s`

let dataRequest = async.memoize(function(url, callback) {
	request({
		url: url,
		headers: {
			'User-Agent': 'Github-Request'
		}
	}, function(err, res, body) {
		var data = null
		if (err) return err
		if (res.statusCode == 200) {
			try {
				data = JSON.parse(body)
			} catch (e) {}
		}
		callback(data)
	})
})

router.get('/', function(req, res) {
	res.render('index')
})

router.get('/user', function(req, res) {
	if (req.query.user)
		res.redirect('/user/' + req.query.user)
	else
		rs.redirect('/')
})

router.get('/user/:user', function(req, res) {
	var url = util.format(userUrl, req.params.user)
	dataRequest(url, function(data) {
		if (data && data.login) {
			res.render('users', {
				user: data.login,
				repos: data.public_repos,
				avatar: data.avatar_url,
				followers: data.followers,
				following: data.following
			})
		} else {
			res.render('fail', {
				user: req.params.user
			})
		}
	})
})

router.get('/user/:user/followers', function(req, res) {
	var url = util.format(subUrl, req.params.user, 'followers')
	dataRequest(url, function(data) {
		res.render('followers', {
			user: req.params.user,
			followers: data
		})
	})
})

router.get('/user/:user/repos', function(req, res) {
	var url = util.format(subUrl, req.params.user, 'repos')
	dataRequest(url, function(data) {
		res.render('repos', {
			user: req.params.user,
			repos: data
		})
	})
})

module.exports = router

