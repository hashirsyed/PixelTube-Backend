// const { Users } = require("../models");
const { Playlists } = require("../models");
const { PlaylistVideos } = require("../models");
const { Videos } = require("../models");
const { Channels } = require("../models");
const { Users } = require("../models");
const { generateErrorInstance } = require("../utils");

module.exports = {
  create: async function (req, res) {
    try {
      let { name, description } = req.body;
      const { userId } = req.params;
      if (!name && !userId) {
        throw generateErrorInstance({
          status: 404,
          message: "Required fields cannot be empty",
        });
      }
      let playlist = await Playlists.findOne({
        where: {
          name,
        },
      });

      if (playlist) {
        throw generateErrorInstance({
          status: 409,
          message: "Playlist already exists ",
        });
      }
      playlist = await Playlists.create({
        name,
        description,
        fkUserId: userId,
      });
      playlist = await playlist.toJSON();

      res.status(201).send({
        message: "Playliat Created Successfully",
        playlist,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getAll: async function (req, res) {
    try {
      let { userId } = req.params;
      let playlists = await Playlists.findAll({
        where: {
          fkUserId: userId,
        },
        include: [
          {
            model: PlaylistVideos,
            as: "playlistvideo",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).send({
        playlists,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  addVideo: async function (req, res) {
    try {
      let { playlistId, videoId } = req.params;

      // Await the findOne query to ensure it resolves before proceeding
      let video = await PlaylistVideos.findOne({
        where: {
          fkPlaylistId: playlistId,
          fkVideoId: videoId,
        },
      });

      if (video) {
        throw generateErrorInstance({
          status: 409,
          message: "Video already exists in this playlist",
        });
      }

      video = await PlaylistVideos.create({
        fkPlaylistId: playlistId,
        fkVideoId: videoId,
      });

      res.status(201).send({
        message: "Video Added successfully to the playlist",
        video,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  findVideoInPlaylist: async function (req, res) {
    try {
      let { videoId } = req.params;

      let videos = await PlaylistVideos.findAll({
        where: {
          fkVideoId: videoId,
        },
      });

      res.status(200).send({
        videos,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  findAllVideos: async function (req, res) {
    try {
      let { playlistId } = req.params;

      let videos = await PlaylistVideos.findAll({
        where: {
          fkPlaylistId: playlistId,
        },
        include : [
          {
            model : Videos,
            as : "video",
            include : {
              model : Channels,
              as : "channel",
              include : {
                model : Users,
                as : "user"
              }
            }
          },
          {
            model : Playlists,
            as : "playlist"
          }
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).send({
        videos,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  edit: async function (req, res) {
    try {
      let { name, description } = req.body;
      const { playlistId } = req.params;

      if (!playlistId) {
        throw generateErrorInstance({
          status: 404,
          message: "Playlist Id is required",
        });
      }

      let playlist = await Playlists.findOne({
        where: {
          id: playlistId,
        },
      });

      if (!playlist) {
        return res.status(404).send("PLaylist not found");
      }
      await playlist.update({
        name,
        description,
      });


      res
        .status(200)
        .send({ message: "Playlist updated successfully", playlist });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getPlaylistDetails: async function (req, res) {
    try {
      let { playlistId } = req.params;
      let playlist = await Playlists.findOne({
        where: {
          id: playlistId,
        },
      });

      res.status(201).send({
        playlist,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  deletePlaylist: async function (req, res) {
    try {
      let { playlistId } = req.params;
      let playlist = await Playlists.destroy({
        where: {
          id: playlistId,
        },
      });
      res.status(201).send({
        message : "Playlist deleted successfully",
        playlist,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  removeVideoFromPlaylist: async function (req, res) {
    try {
      let { videoId , playlistId } = req.params;
      let video = await PlaylistVideos.destroy({
        where: {
          fkVideoId: videoId,
          fkPlaylistId: playlistId,
        },
      });
      res.status(201).send({
        message : "Video removed from playlist successfully",
        video,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
};
