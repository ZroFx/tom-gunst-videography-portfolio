import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor TomGunstPortfolio {
  let storage = Storage.new();
  include MixinStorage(storage);

  let accessControlState = AccessControl.initState();

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  type VideoProject = {
    id : Text;
    title : Text;
    description : Text;
    video : ?Storage.ExternalBlob;
    thumbnail : ?Storage.ExternalBlob;
    visible : Bool;
    youtubeUrl : ?Text;
  };

  type ContactInfo = {
    email : Text;
    tel : Text;
    socialMedia : [SocialMediaLink];
  };

  type SocialMediaLink = {
    platform : Text;
    url : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type AboutPageContent = {
    title : Text;
    content : Text;
    placeholder : Bool;
  };

  type Stats = {
    totalVisits : Nat;
    videoViews : [(Text, Nat)];
  };

  var videoProjects : OrderedMap.Map<Text, VideoProject> = textMap.empty<VideoProject>();
  var videoOrder : [Text] = [];
  var contactInfo : ?ContactInfo = null;
  var userProfiles : OrderedMap.Map<Principal, UserProfile> = principalMap.empty<UserProfile>();
  var aboutPageContent : ?AboutPageContent = null;
  var totalVisits : Nat = 0;
  var videoViews : OrderedMap.Map<Text, Nat> = textMap.empty<Nat>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public shared ({ caller }) func addVideoProject(id : Text, title : Text, description : Text, video : ?Storage.ExternalBlob, thumbnail : ?Storage.ExternalBlob, youtubeUrl : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add video projects");
    };
    let project : VideoProject = {
      id;
      title;
      description;
      video;
      thumbnail;
      visible = true;
      youtubeUrl;
    };
    videoProjects := textMap.put(videoProjects, id, project);
    videoOrder := Array.append(videoOrder, [id]);
  };

  public query func getVideoProjects() : async [VideoProject] {
    let orderedProjects = Array.mapFilter<Text, VideoProject>(
      videoOrder,
      func(id) {
        switch (textMap.get(videoProjects, id)) {
          case (?project) {
            if (project.visible) { ?project } else { null };
          };
          case (null) { null };
        };
      },
    );
    orderedProjects;
  };

  public query ({ caller }) func getAllVideoProjects() : async [VideoProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all video projects");
    };
    let orderedProjects = Array.mapFilter<Text, VideoProject>(
      videoOrder,
      func(id) {
        textMap.get(videoProjects, id);
      },
    );
    orderedProjects;
  };

  public query ({ caller }) func getVideoProject(id : Text) : async ?VideoProject {
    switch (textMap.get(videoProjects, id)) {
      case (?project) {
        if (project.visible or AccessControl.isAdmin(accessControlState, caller)) {
          ?project;
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateVideoProject(id : Text, title : Text, description : Text, video : ?Storage.ExternalBlob, thumbnail : ?Storage.ExternalBlob, youtubeUrl : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update video projects");
    };
    switch (textMap.get(videoProjects, id)) {
      case (?existingProject) {
        let updatedProject : VideoProject = {
          id;
          title;
          description;
          video;
          thumbnail;
          visible = existingProject.visible;
          youtubeUrl;
        };
        videoProjects := textMap.put(videoProjects, id, updatedProject);
      };
      case (null) {
        Debug.trap("Video project not found");
      };
    };
  };

  public shared ({ caller }) func updateThumbnail(id : Text, thumbnail : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update thumbnails");
    };
    switch (textMap.get(videoProjects, id)) {
      case (?existingProject) {
        let updatedProject : VideoProject = {
          existingProject with thumbnail = ?thumbnail
        };
        videoProjects := textMap.put(videoProjects, id, updatedProject);
      };
      case (null) {
        Debug.trap("Video project not found");
      };
    };
  };

  public shared ({ caller }) func deleteVideoProject(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete video projects");
    };
    videoProjects := textMap.remove(videoProjects, id).0;
    videoOrder := Array.filter<Text>(videoOrder, func(x) { x != id });
  };

  public shared ({ caller }) func setContactInfo(email : Text, tel : Text, socialMedia : [SocialMediaLink]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set contact info");
    };
    contactInfo := ?{
      email;
      tel;
      socialMedia;
    };
  };

  public query func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func updateVideoOrder(newOrder : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update video order");
    };
    videoOrder := newOrder;
  };

  public query ({ caller }) func getVideoOrder() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view video order");
    };
    videoOrder;
  };

  public shared ({ caller }) func toggleVideoVisibility(id : Text, visible : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can toggle video visibility");
    };
    switch (textMap.get(videoProjects, id)) {
      case (?project) {
        let updatedProject : VideoProject = {
          project with visible
        };
        videoProjects := textMap.put(videoProjects, id, updatedProject);
      };
      case (null) {
        Debug.trap("Video project not found");
      };
    };
  };

  public shared ({ caller }) func setAboutPageContent(title : Text, content : Text, placeholder : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set about page content");
    };
    aboutPageContent := ?{
      title;
      content;
      placeholder;
    };
  };

  public query func getAboutPageContent() : async ?AboutPageContent {
    aboutPageContent;
  };

  public shared func incrementTotalVisits() : async () {
    totalVisits += 1;
  };

  public shared func incrementVideoView(videoId : Text) : async () {
    let currentViews = switch (textMap.get(videoViews, videoId)) {
      case (?views) { views };
      case (null) { 0 };
    };
    videoViews := textMap.put(videoViews, videoId, currentViews + 1);
  };

  public query ({ caller }) func getStats() : async Stats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view stats");
    };
    {
      totalVisits;
      videoViews = Iter.toArray(textMap.entries(videoViews));
    };
  };
};

