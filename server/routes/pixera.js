// Pixera API routing

const express = require("express");
const router = express.Router();
const { sendTcpData } = require("../config");

const timelineRouter = require("./timeline");
const inputRouter = require("./inputs");
const layerRouter = require("./layer");

router.get("/check", async (req, res) => {
  try {
    const ip = req.body.ip;
    const message = JSON.stringify({ jsonrpc: "2.0", id: 5, method: "Pixera.Utility.getCurrentTime" }) + "0xPX";
    const data = JSON.parse(await sendTcpData(message));
    res.send(data.result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.use("/timeline", timelineRouter);
router.use("/inputs", inputRouter);
router.use("/layer", layerRouter);

module.exports = router;

/*

{"jsonrpc":"2.0", "id":5, "method":"Pixera.Utility.getCurrentTime"}

 // Returns true if the resource is currently referred to in a timeline
      // (via a clip or a dominant value).
      double getIsInUse();
       => {"jsonrpc":"2.0", "id":353, "method":"Pixera.Resources.Resource.getIsInUse", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":353, "result":1.0}
// Returns list of available Video Modes of a Live Input Resource,
      // not all Live Input Resources have a list of modes.
      string[] getVideoStreamModes();
       => {"jsonrpc":"2.0", "id":341, "method":"Pixera.Resources.Resource.getVideoStreamModes", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":341, "result":[Efgh, ...]}

      // Set the Video Mode of a Live Input Resource by it's index.
      null setVideoStreamMode(int index);
       => {"jsonrpc":"2.0", "id":342, "method":"Pixera.Resources.Resource.setVideoStreamMode", "params":{"handle":123456789, "index":1}}
       <= {"jsonrpc":"2.0", "id":342}
// Returns the active state of a Live Input Resource
      boolean getIsActive();
       => {"jsonrpc":"2.0", "id":340, "method":"Pixera.Resources.Resource.getIsActive", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":340, "result":true}
string getName();
       => {"jsonrpc":"2.0", "id":336, "method":"Pixera.Resources.Resource.getName", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":336, "result":"Abcd"}
      null setName(string name);
       => {"jsonrpc":"2.0", "id":337, "method":"Pixera.Resources.Resource.setName", "params":{"handle":123456789, "name":"Abcd"}}
       <= {"jsonrpc":"2.0", "id":337}
      double getFps();
       => {"jsonrpc":"2.0", "id":338, "method":"Pixera.Resources.Resource.getFps", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":338, "result":1.0}
      double[] getResolution();
       => {"jsonrpc":"2.0", "id":339, "method":"Pixera.Resources.Resource.getResolution", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":339, "result":[1.0, ...]}

       string getType();
       => {"jsonrpc":"2.0", "id":345, "method":"Pixera.Resources.Resource.getType", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":345, "result":"Abcd"}

        string getJsonDescrip();
    => {"jsonrpc":"2.0", "id":293, "method":"Pixera.Resources.getJsonDescrip"}
    <= {"jsonrpc":"2.0", "id":293, "result":"Abcd"}

// Register the parameter for use with the Direct API. At the time when this function is executed
   // the layer should already have been displayed at least once. Otherwise the relevant underlying
   // attributes may not have been initialized yet and can not be cached.
   // The instance path traces the name hierarchy in the timeline tree. E.g. "Timeline 1.Position.x".
   handle registerParam(string instancePath);
    => {"jsonrpc":"2.0", "id":699, "method":"Pixera.Direct.registerParam", "params":{"instancePath":"Abcd"}}
    <= {"jsonrpc":"2.0", "id":699, "result":123456789}

// Sets the param value. Note that this will bypass conversions and offsets determined by the GUI. 
      // E.g. layer-level offsets will not be taken into account and neither will resource-dependent scaling.
      null setValue(double value);
       => {"jsonrpc":"2.0", "id":700, "method":"Pixera.Direct.Param.setValue", "params":{"handle":123456789, "value":1.0}}
       <= {"jsonrpc":"2.0", "id":700}

       // Add effect by resource id.
      // Use Pixera.Resources.Resource.getInst(resourcePath).getId() to get resource id.
      null addEffectById(double id);
       => {"jsonrpc":"2.0", "id":550, "method":"Pixera.Timelines.Layer.addEffectById", "params":{"handle":123456789, "id":1.0}}
       <= {"jsonrpc":"2.0", "id":550}

Set offsets.
      null setOffsets(optional<double> x,optional<double> y,optional<double> z,optional<double> xr,optional<double> yr,optional<double> zr,optional<double> xScale,optional<double> yScale,optional<double> zScale);
       => {"jsonrpc":"2.0", "id":557, "method":"Pixera.Timelines.Layer.setOffsets", "params":{"handle":123456789, "x":val, "y":val, "z":val, "xr":val, "yr":val, "zr":val, "xScale":val, "yScale":val, "zScale":val}}
       <= {"jsonrpc":"2.0", "id":557}

       Get offsets.
      double[] getOffsets();
       => {"jsonrpc":"2.0", "id":556, "method":"Pixera.Timelines.Layer.getOffsets", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":556, "result":[1.0, ...]}

   // Returns the frames per second of the timeline identified by name.
   // name: Name of timeline.
   double getFpsOfTimeline(string name);
    => {"jsonrpc":"2.0", "id":51, "method":"Pixera.Compound.getFpsOfTimeline", "params":{"name":"Abcd"}}
    <= {"jsonrpc":"2.0", "id":51, "result":1.0}


    // Returns the current value of the parameter.
   // The parameter is identified by a path separated by periods (e.g. "Timeline 1.Layer 1.Opacity").
   double getParamValue(string path);
    => {"jsonrpc":"2.0", "id":67, "method":"Pixera.Compound.getParamValue", "params":{"path":"Abcd"}}
    <= {"jsonrpc":"2.0", "id":67, "result":1.0}

    // Returns handles to all resources (including within subfolders) in the resource
   // tree in the Compositing tab.
   handle[] getResources();
    => {"jsonrpc":"2.0", "id":289, "method":"Pixera.Resources.getResources"}
    <= {"jsonrpc":"2.0", "id":289, "result":[123456789, ...]}

    // Returns handles to all the resources that are directly in one folder (i.e. does not consider subfolders).
      handle[] getResources();
       => {"jsonrpc":"2.0", "id":298, "method":"Pixera.Resources.ResourceFolder.getResources", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":298, "result":[123456789, ...]}
      handle getResourceAtIndex(int index);
       => {"jsonrpc":"2.0", "id":299, "method":"Pixera.Resources.ResourceFolder.getResourceAtIndex", "params":{"handle":123456789, "index":1}}
       <= {"jsonrpc":"2.0", "id":299, "result":123456789}

       string getName();
       => {"jsonrpc":"2.0", "id":336, "method":"Pixera.Resources.Resource.getName", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":336, "result":"Abcd"}
      null setName(string name);
       => {"jsonrpc":"2.0", "id":337, "method":"Pixera.Resources.Resource.setName", "params":{"handle":123456789, "name":"Abcd"}}
       <= {"jsonrpc":"2.0", "id":337}
      double getFps();
       => {"jsonrpc":"2.0", "id":338, "method":"Pixera.Resources.Resource.getFps", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":338, "result":1.0}
      double[] getResolution();
       => {"jsonrpc":"2.0", "id":339, "method":"Pixera.Resources.Resource.getResolution", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":339, "result":[1.0, ...]}

      // Returns the active state of a Live Input Resource
      boolean getIsActive();
       => {"jsonrpc":"2.0", "id":340, "method":"Pixera.Resources.Resource.getIsActive", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":340, "result":true}

     // Returns an id based on the handle. This is currently necessary in some situations
      // because some API implementations can not yet consume handles as parameters.
      double getId();
       => {"jsonrpc":"2.0", "id":343, "method":"Pixera.Resources.Resource.getId", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":343, "result":1.0}
       
       // Returns the png thumbnail data of the resource in a base 64 string. This is the
      // image that is shown in the resource tree. Its resolution is currently 256 * 174
      // pixels.
      string getThumbnailAsBase64();
       => {"jsonrpc":"2.0", "id":351, "method":"Pixera.Resources.Resource.getThumbnailAsBase64", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":351, "result":"Abcd"}

       // Returns true if the resource is currently referred to in a timeline
      // (via a clip or a dominant value).
      double getIsInUse();
       => {"jsonrpc":"2.0", "id":353, "method":"Pixera.Resources.Resource.getIsInUse", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":353, "result":1.0}

       // Returns the handle of the timeline at the (zero-based) index in
   // the timeline library of the Compositing tab.
   handle getTimelineAtIndex(int index);
    => {"jsonrpc":"2.0", "id":415, "method":"Pixera.Timelines.getTimelineAtIndex", "params":{"index":1}}
    <= {"jsonrpc":"2.0", "id":415, "result":123456789}

   // Returns the handle of the timeline with the given name (as shown in the 
   // timeline library).
   handle getTimelineFromName(string name);
    => {"jsonrpc":"2.0", "id":416, "method":"Pixera.Timelines.getTimelineFromName", "params":{"name":"Abcd"}}
    <= {"jsonrpc":"2.0", "id":416, "result":123456789}

   // Returns handles to all timelines.
   handle[] getTimelines();
    => {"jsonrpc":"2.0", "id":417, "method":"Pixera.Timelines.getTimelines"}
    <= {"jsonrpc":"2.0", "id":417, "result":[123456789, ...]}

   // Returns names to all timelines.
   string[] getTimelineNames();
    => {"jsonrpc":"2.0", "id":418, "method":"Pixera.Timelines.getTimelineNames"}
    <= {"jsonrpc":"2.0", "id":418, "result":[Efgh, ...]}

   // Returns handles to all selected timelines
   handle[] getTimelinesSelected();
    => {"jsonrpc":"2.0", "id":419, "method":"Pixera.Timelines.getTimelinesSelected"}
    <= {"jsonrpc":"2.0", "id":419, "result":[123456789, ...]}

   // Create Timeline
   handle createTimeline();
    => {"jsonrpc":"2.0", "id":420, "method":"Pixera.Timelines.createTimeline"}
    <= {"jsonrpc":"2.0", "id":420, "result":123456789}

   struct TimelineAttributes
   {
      int index;
      string name;
      double fps;
      int mode;
   }

   // Removes the timeline.
      null removeThis();
       => {"jsonrpc":"2.0", "id":422, "method":"Pixera.Timelines.Timeline.removeThis", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":422}

      // Duplicate the timeline. withoutClipsCues is optional and on default false
      handle duplicateThis(optional<bool> withoutClipsCues);
       => {"jsonrpc":"2.0", "id":423, "method":"Pixera.Timelines.Timeline.duplicateThis", "params":{"handle":123456789, "withoutClipsCues":val}}
       <= {"jsonrpc":"2.0", "id":423, "result":123456789}

      // Select the timeline.
      null selectThis();
       => {"jsonrpc":"2.0", "id":424, "method":"Pixera.Timelines.Timeline.selectThis", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":424}

     // Returns handles to all layers of the timeline.
      handle[] getLayers();
       => {"jsonrpc":"2.0", "id":432, "method":"Pixera.Timelines.Timeline.getLayers", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":432, "result":[123456789, ...]}

      // Returns names to all layers of the timeline.
      string[] getLayerNames();
       => {"jsonrpc":"2.0", "id":433, "method":"Pixera.Timelines.Timeline.getLayerNames", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":433, "result":[Efgh, ...]}

      // Returns handles to all selected layers of the timeline.
      handle[] getLayersSelected();
       => {"jsonrpc":"2.0", "id":434, "method":"Pixera.Timelines.Timeline.getLayersSelected", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":434, "result":[123456789, ...]}

      // Select Layer by index of the timeline.
      null selectLayerByIndex(int index);
       => {"jsonrpc":"2.0", "id":435, "method":"Pixera.Timelines.Timeline.selectLayerByIndex", "params":{"handle":123456789, "index":1}}
       <= {"jsonrpc":"2.0", "id":435}

      // Select Layers of the timeline by Names.
      null selectLayerByNames(string[] layerNames);
       => {"jsonrpc":"2.0", "id":436, "method":"Pixera.Timelines.Timeline.selectLayerByNames", "params":{"handle":123456789, "layerNames":[Efgh, ...]}}
       <= {"jsonrpc":"2.0", "id":436}

      // Returns a handle to the layer in the timeline at the (zero-based) index in
      // the order as shown in the Pixera Timeline interface.
      handle getLayerAtIndex(int index);
       => {"jsonrpc":"2.0", "id":437, "method":"Pixera.Timelines.Timeline.getLayerAtIndex", "params":{"handle":123456789, "index":1}}
       <= {"jsonrpc":"2.0", "id":437, "result":123456789}

      // Creates a layer and returns a handle to it.
      handle createLayer();
       => {"jsonrpc":"2.0", "id":438, "method":"Pixera.Timelines.Timeline.createLayer", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":438, "result":123456789}
      string getCueInfosAsJsonString();
       => {"jsonrpc":"2.0", "id":439, "method":"Pixera.Timelines.Timeline.getCueInfosAsJsonString", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":439, "result":"Abcd"}

      // Returns the handles of all cues in chronological order.
      handle[] getCues();
       => {"jsonrpc":"2.0", "id":440, "method":"Pixera.Timelines.Timeline.getCues", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":440, "result":[123456789, ...]}

      // Returns names to all cues.
      string[] getCueNames();
       => {"jsonrpc":"2.0", "id":441, "method":"Pixera.Timelines.Timeline.getCueNames", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":441, "result":[Efgh, ...]}

      // Returns the handle of the cue with the given index. 
      // Indices are in chronological order.
      handle getCueAtIndex(int index);
       => {"jsonrpc":"2.0", "id":442, "method":"Pixera.Timelines.Timeline.getCueAtIndex", "params":{"handle":123456789, "index":1}}
       <= {"jsonrpc":"2.0", "id":442, "result":123456789}

      // Returns the handle of the cue with the given name.
      // If multiple cues have the same name, the handle to the first match will be returned.
      // name: name of cue
      handle getCueFromName(string name);
       => {"jsonrpc":"2.0", "id":443, "method":"Pixera.Timelines.Timeline.getCueFromName", "params":{"handle":123456789, "name":"Abcd"}}
       <= {"jsonrpc":"2.0", "id":443, "result":123456789}

      // Returns the handle of the cue with the given number.
      // If multiple cues have the same number, the handle to the first match will be returned.
      // number: number of cue
      handle getCueFromNumber(int number);
       => {"jsonrpc":"2.0", "id":444, "method":"Pixera.Timelines.Timeline.getCueFromNumber", "params":{"handle":123456789, "number":1}}
       <= {"jsonrpc":"2.0", "id":444, "result":123456789}

      // Jumps to and executes the cue with the given name.
      // name: name of cue
      // blendDuration: optional parameter to set blend duration in seconds.
      null applyCueWithName(string name,optional<double> blendDuration);
       => {"jsonrpc":"2.0", "id":445, "method":"Pixera.Timelines.Timeline.applyCueWithName", "params":{"handle":123456789, "name":"Abcd", "blendDuration":val}}
       <= {"jsonrpc":"2.0", "id":445}

      // Jumps to and executes the cue with the given number.
      // number: number of cue
      // blendDuration: optional parameter to set blend duration in seconds.
      null applyCueWithNumber(int number,optional<double> blendDuration);
       => {"jsonrpc":"2.0", "id":446, "method":"Pixera.Timelines.Timeline.applyCueWithNumber", "params":{"handle":123456789, "number":1, "blendDuration":val}}
       <= {"jsonrpc":"2.0", "id":446}

      // Creates a cue and returns its handle.
      // name: Name of the cue
      // timeInFrames: Time on timeline in total frames
      // operation:
      // 1:Play
      // 2:Pause
      // 3:Jump
      // 4:Stop
      handle createCue(string name,double timeInFrames,int operation);
       => {"jsonrpc":"2.0", "id":447, "method":"Pixera.Timelines.Timeline.createCue", "params":{"handle":123456789, "name":"Abcd", "timeInFrames":1.0, "operation":1}}
       <= {"jsonrpc":"2.0", "id":447, "result":123456789}

      // Removes all cues.
      null removeCues();
       => {"jsonrpc":"2.0", "id":448, "method":"Pixera.Timelines.Timeline.removeCues", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":448}

      // Create pause cue before selected clips
      null createPauseCueBeforeSelectedClips();
       => {"jsonrpc":"2.0", "id":449, "method":"Pixera.Timelines.Timeline.createPauseCueBeforeSelectedClips", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":449}

      // Starts the timeline at the current time.
      null play();
       => {"jsonrpc":"2.0", "id":450, "method":"Pixera.Timelines.Timeline.play", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":450}

      // Pauses the timeline at the current time.
      null pause();
       => {"jsonrpc":"2.0", "id":451, "method":"Pixera.Timelines.Timeline.pause", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":451}

      // Stops the timeline.
      null stop();
       => {"jsonrpc":"2.0", "id":452, "method":"Pixera.Timelines.Timeline.stop", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":452}

      // Toggles the timeline transport mode between play and pause.
      null toggleTransport();
       => {"jsonrpc":"2.0", "id":453, "method":"Pixera.Timelines.Timeline.toggleTransport", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":453}
       
       // Returns the attributes of the timeline (see TimelineAttributes struct).
      null getAttributes();
       => {"jsonrpc":"2.0", "id":456, "method":"Pixera.Timelines.Timeline.getAttributes", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":456, "result":{"index":1, "name":"Abcd", "fps":1.0, "mode":1}}

       // Rename the timeline.
      null setName(string name);
       => {"jsonrpc":"2.0", "id":467, "method":"Pixera.Timelines.Timeline.setName", "params":{"handle":123456789, "name":"Abcd"}}
       <= {"jsonrpc":"2.0", "id":467}

       // Removes the layer.
      null removeThis();
       => {"jsonrpc":"2.0", "id":497, "method":"Pixera.Timelines.Layer.removeThis", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":497}

       // Returns the current position, rotation and scale values (array with 9 entries) 
      // of the layer as determined by the clip at the given time. If no clip is found
      // then the returned array will be empty.
      double[] getSpatialParametersAtTime(double time);
       => {"jsonrpc":"2.0", "id":501, "method":"Pixera.Timelines.Layer.getSpatialParametersAtTime", "params":{"handle":123456789, "time":1.0}}
       <= {"jsonrpc":"2.0", "id":501, "result":[1.0, ...]}

      // Returns the parent timeline.
      handle getTimeline();
       => {"jsonrpc":"2.0", "id":502, "method":"Pixera.Timelines.Layer.getTimeline", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":502, "result":123456789}

      // Returns the name of the layer.
      string getName();
       => {"jsonrpc":"2.0", "id":504, "method":"Pixera.Timelines.Layer.getName", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":504, "result":"Abcd"}
       
      // Assigns a resource to the layer. The id is conceptually the handle but the
      // handle can not be passed directly for some implementations of the API. Therefore,
      // Resource.getId() should be used to fill this parameter.
      // Note that, up to and including API revision 14, this function took effect by
      // changing the resource assignment of the current clip. From revision 15 onwards,
      // the function works by assigning the resource to the layer as a dominant value
      // independent of the clips in the layer.
      null assignResource(double id);
       => {"jsonrpc":"2.0", "id":529, "method":"Pixera.Timelines.Layer.assignResource", "params":{"handle":123456789, "id":1.0}}
       <= {"jsonrpc":"2.0", "id":529}

      // Assigns a resource to the layer while besides the resource id also a fade duration
      // has to be passed to the function. The id is conceptually the handle but the handle
      // can not be passed directly for some implementations of the API. Therefore,
      // Resource.getId() should be used to fill this parameter. The unit of the parameter
      // fadeDuration is seconds. Only pass values >= 0. While 0 means 'no fade'.
      null assignResourceWithFade(double id,double fadeDuration);
       => {"jsonrpc":"2.0", "id":530, "method":"Pixera.Timelines.Layer.assignResourceWithFade", "params":{"handle":123456789, "id":1.0, "fadeDuration":1.0}}
       <= {"jsonrpc":"2.0", "id":530}

      // Returns the resource currently assigned to the layer.
      handle getAssignedResource();
       => {"jsonrpc":"2.0", "id":531, "method":"Pixera.Timelines.Layer.getAssignedResource", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":531, "result":123456789}

      // Reset the resource currently assigned to the layer.
      null resetAssignedResource();
       => {"jsonrpc":"2.0", "id":532, "method":"Pixera.Timelines.Layer.resetAssignedResource", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":532}
       
      // Creates a clip at current time and returns a handle to it.
      handle createClip();
       => {"jsonrpc":"2.0", "id":538, "method":"Pixera.Timelines.Layer.createClip", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":538, "result":123456789}

      // Creates a clip at the given time and returns a handle to it.
      // Time in frames.
      handle createClipAtTime(double timeInFrames);
       => {"jsonrpc":"2.0", "id":539, "method":"Pixera.Timelines.Layer.createClipAtTime", "params":{"handle":123456789, "timeInFrames":1.0}}
       <= {"jsonrpc":"2.0", "id":539, "result":123456789}
      null controlClipBorder(handle clip,boolean isEnter,boolean isIncremental,double entryTime);
       => {"jsonrpc":"2.0", "id":540, "method":"Pixera.Timelines.Layer.controlClipBorder", "params":{"handle":123456789, "clip":123456789, "isEnter":true, "isIncremental":true, "entryTime":1.0}}
       <= {"jsonrpc":"2.0", "id":540}

      // Returns the clip at the given index. Index is 0-based.
      handle getClipAtIndex(int index);
       => {"jsonrpc":"2.0", "id":541, "method":"Pixera.Timelines.Layer.getClipAtIndex", "params":{"handle":123456789, "index":1}}
       <= {"jsonrpc":"2.0", "id":541, "result":123456789}

      // Returns all clips.
      handle[] getClips();
       => {"jsonrpc":"2.0", "id":542, "method":"Pixera.Timelines.Layer.getClips", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":542, "result":[123456789, ...]}

      // Returns current clip
      handle getClipCurrent(int offset);
       => {"jsonrpc":"2.0", "id":543, "method":"Pixera.Timelines.Layer.getClipCurrent", "params":{"handle":123456789, "offset":1}}
       <= {"jsonrpc":"2.0", "id":543, "result":123456789}

      // Returns all clips.
      handle[] getClipsSelected();
       => {"jsonrpc":"2.0", "id":544, "method":"Pixera.Timelines.Layer.getClipsSelected", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":544, "result":[123456789, ...]}

      // Removes all clips.
      null removeClips();
       => {"jsonrpc":"2.0", "id":545, "method":"Pixera.Timelines.Layer.removeClips", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":545}
       
      // Get offsets.
      double[] getOffsets();
       => {"jsonrpc":"2.0", "id":556, "method":"Pixera.Timelines.Layer.getOffsets", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":556, "result":[1.0, ...]}

      // Set offsets.
      null setOffsets(optional<double> x,optional<double> y,optional<double> z,optional<double> xr,optional<double> yr,optional<double> zr,optional<double> xScale,optional<double> yScale,optional<double> zScale);
       => {"jsonrpc":"2.0", "id":557, "method":"Pixera.Timelines.Layer.setOffsets", "params":{"handle":123456789, "x":val, "y":val, "z":val, "xr":val, "yr":val, "zr":val, "xScale":val, "yScale":val, "zScale":val}}
       <= {"jsonrpc":"2.0", "id":557}
       
      // Returns an id based on the handle. This is currently necessary in some situations
      // because some API implementations can not yet consume handles as parameters. 
      double getId();
       => {"jsonrpc":"2.0", "id":562, "method":"Pixera.Timelines.Clip.getId", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":562, "result":1.0}

      // Removes the clip.
      null removeThis();
       => {"jsonrpc":"2.0", "id":563, "method":"Pixera.Timelines.Clip.removeThis", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":563}

      // Returns a handle to the timeline in which the clip is situated.
      handle getTimeline();
       => {"jsonrpc":"2.0", "id":564, "method":"Pixera.Timelines.Clip.getTimeline", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":564, "result":123456789}
      null setTime(double time);
       => {"jsonrpc":"2.0", "id":565, "method":"Pixera.Timelines.Clip.setTime", "params":{"handle":123456789, "time":1.0}}
       <= {"jsonrpc":"2.0", "id":565}
      double getTime();
       => {"jsonrpc":"2.0", "id":566, "method":"Pixera.Timelines.Clip.getTime", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":566, "result":1.0}
      null setDuration(double duration);
       => {"jsonrpc":"2.0", "id":567, "method":"Pixera.Timelines.Clip.setDuration", "params":{"handle":123456789, "duration":1.0}}
       <= {"jsonrpc":"2.0", "id":567}
      double getDuration();
       => {"jsonrpc":"2.0", "id":568, "method":"Pixera.Timelines.Clip.getDuration", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":568, "result":1.0}
      null setLabel(string label);
       => {"jsonrpc":"2.0", "id":569, "method":"Pixera.Timelines.Clip.setLabel", "params":{"handle":123456789, "label":"Abcd"}}
       <= {"jsonrpc":"2.0", "id":569}
      string getLabel();
       => {"jsonrpc":"2.0", "id":570, "method":"Pixera.Timelines.Clip.getLabel", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":570, "result":"Abcd"}

      // Play modes:
      // 1: Lock to time
      // 2: Play once
      // 3: Loop
      // 4: Pause at endpoint
      // 5: Lock to time no loop
      int getPlayMode();
       => {"jsonrpc":"2.0", "id":571, "method":"Pixera.Timelines.Clip.getPlayMode", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":571, "result":1}
      null setPlayMode(int playMode);
       => {"jsonrpc":"2.0", "id":572, "method":"Pixera.Timelines.Clip.setPlayMode", "params":{"handle":123456789, "playMode":1}}
       <= {"jsonrpc":"2.0", "id":572}
       
       // Assigns a resource to the resource parameter within the clip.
      // Conceptually, the resId is a handle but the handle can not be passed directly for
      // some implementations of the API. Therefore, Resource.getId() should be used to
      // fill this parameter.
      // setToResourceDuration is optional and true if not set
      null assignResource(double resId,optional<bool> setToResourceDuration);
       => {"jsonrpc":"2.0", "id":581, "method":"Pixera.Timelines.Clip.assignResource", "params":{"handle":123456789, "resId":1.0, "setToResourceDuration":val}}
       <= {"jsonrpc":"2.0", "id":581}

      // Assigns a resource to the resource parameter within the clip.
      // Conceptually, the resId is a handle but the handle can not be passed directly for
      // some implementations of the API. Therefore, Resource.getId() should be used to
      // fill this parameter.
      handle getAssignedResource();
       => {"jsonrpc":"2.0", "id":582, "method":"Pixera.Timelines.Clip.getAssignedResource", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":582, "result":123456789}
      null setToResourceDuration();
       => {"jsonrpc":"2.0", "id":583, "method":"Pixera.Timelines.Clip.setToResourceDuration", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":583}

      // Creates a key at the given time with the given value in the clip parameter specified by
      // namePath, with the parts of namePath consisting of the strings shown in the timeline UI.
      // E.g. "Position/x" refers to the parameter responsible for the x position of the layer.
      // The name of this method may be changed in future versions of the API to reflect the 
      // "key" (instead of "event") terminology.
      null createEvent(string namePath,double time,double value);
       => {"jsonrpc":"2.0", "id":584, "method":"Pixera.Timelines.Clip.createEvent", "params":{"handle":123456789, "namePath":"Abcd", "time":1.0, "value":1.0}}
       <= {"jsonrpc":"2.0", "id":584}

      // Creates a key at the given time with the given value in the clip parameter specified by
      // namePath, with the parts of namePath consisting of the strings shown in the timeline UI.
      // E.g. "Position/x" refers to the parameter responsible for the x position of the layer.
      // The name of this method may be changed in future versions of the API to reflect the 
      // "key" (instead of "event") terminology.
      null createEventInPixelSpace(string namePath,double time,double value);
       => {"jsonrpc":"2.0", "id":585, "method":"Pixera.Timelines.Clip.createEventInPixelSpace", "params":{"handle":123456789, "namePath":"Abcd", "time":1.0, "value":1.0}}
       <= {"jsonrpc":"2.0", "id":585}

      // Remove a key at the given time with the given by namePath,
      // with the parts of namePath consisting of the strings shown in the timeline UI.
      // E.g. "Position/x" refers to the parameter responsible for the x position of the layer.
      // The name of this method may be changed in future versions of the API to reflect the 
      // "key" (instead of "event") terminology.
      null removeEvent(string namePath,double time);
       => {"jsonrpc":"2.0", "id":586, "method":"Pixera.Timelines.Clip.removeEvent", "params":{"handle":123456789, "namePath":"Abcd", "time":1.0}}
       <= {"jsonrpc":"2.0", "id":586}

      // Creates a Cue Before Clip
      handle createPauseCueBeforeClip();
       => {"jsonrpc":"2.0", "id":587, "method":"Pixera.Timelines.Clip.createPauseCueBeforeClip", "params":{"handle":123456789}}
       <= {"jsonrpc":"2.0", "id":587, "result":123456789}

       
*/
