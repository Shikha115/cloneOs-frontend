import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Upload,
  Play,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  User,
  Shirt,
  FileText,
  Film,
  Video,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { usepst, useToast } from "../hooks/use-toast";
import {
  mockActors,
  mockLanguages,
  mockVoiceStyles,
  mockVideoModels,
  mockStoryboardFrames,
  mockSelectedActors,
  mockFunctions,
} from "../components/mock";
import { useAuthStore } from "../store/auth.store";
import { logout } from "../services/auth.service";

const Dashboard = () => {
  const [selectedActors, setSelectedActors] = useState([]);
  const [currentSection, setCurrentSection] = useState("select-avatar");
  const [script, setScript] = useState("");
  const [storyboardFrames, setStoryboardFrames] =
    useState(mockStoryboardFrames);
  const [selectedVideoModel, setSelectedVideoModel] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use Zustand auth store for state management
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const sectionRefs = {
    "select-avatar": useRef(null),
    "upload-script": useRef(null),
    storyboard: useRef(null),
    "video-generation": useRef(null),
  };

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleActorSelect = (actor) => {
    if (selectedActors.length < 2) {
      setSelectedActors([...selectedActors, { ...actor, isLocked: false }]);
      toast({
        title: "Actor Selected",
        description: `${actor.name} has been added to your selection.`,
      });
    } else {
      toast({
        title: "Maximum Actors Reached",
        description: "You can select maximum 2 actors at a time.",
        variant: "destructive",
      });
    }
  };

  const handleLockActor = (actorId) => {
    setSelectedActors((prev) =>
      prev.map((actor) =>
        actor.id === actorId ? { ...actor, isLocked: !actor.isLocked } : actor
      )
    );
  };

  const handleRemoveActor = (actorId) => {
    setSelectedActors((prev) => prev.filter((actor) => actor.id !== actorId));
  };

  const handleImageUpload = async (file, actorId) => {
    try {
      const imageUrl = await mockFunctions.uploadImage(file);
      setSelectedActors((prev) =>
        prev.map((actor) =>
          actor.id === actorId ? { ...actor, uploadedImage: imageUrl } : actor
        )
      );
      toast({
        title: "Image Uploaded",
        description: "Actor image uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOutfitUpload = async (file, actorId) => {
    try {
      const imageUrl = await mockFunctions.uploadImage(file);
      setSelectedActors((prev) =>
        prev.map((actor) =>
          actor.id === actorId ? { ...actor, outfitImage: imageUrl } : actor
        )
      );

      // Simulate VTON processing
      const actor = selectedActors.find((a) => a.id === actorId);
      if (actor?.uploadedImage) {
        const vtonResult = await mockFunctions.processVTON(
          actor.uploadedImage,
          imageUrl
        );
        setSelectedActors((prev) =>
          prev.map((a) =>
            a.id === actorId
              ? { ...a, vtonResult: vtonResult.processedImage }
              : a
          )
        );
      }

      toast({
        title: "Outfit Uploaded",
        description: "Outfit processed with VTON successfully!",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to process outfit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateStoryboard = async () => {
    if (!script.trim()) {
      toast({
        title: "Script Required",
        description: "Please upload or paste your script first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await mockFunctions.generateStoryboard(script);
      setStoryboardFrames(result.frames);
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate storyboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideo(videoUrl);
      toast({
        title: "Video Uploaded",
        description: "Video uploaded successfully!",
      });
    }
  };

  const handleLogout = () => {
    clearAuth();
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const sections = [
    { id: "select-avatar", title: "1. Select Avatar", icon: User },
    { id: "upload-script", title: "2. Upload Script", icon: FileText },
    { id: "storyboard", title: "3. Generate Storyboard", icon: Film },
    { id: "video-generation", title: "4. Create Video", icon: Video },
  ];

  return (
    <div className="dcverse-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img
              src="https://customer-assets.emergentagent.com/job_5e208c76-5a6c-4a32-8918-b9a39e80d303/artifacts/mvzy74up_Logo%20%282%29.png"
              alt="DCVerse"
              className="logo"
            />
            <span className="logo-text">DCVERSE</span>
          </div>
          <div className="header-actions">
            {user ? (
              <>
                <div className="user-info flex items-center gap-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                  <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                    {user.creditsBalance} credits
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="header-btn text-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <User className="w-4 h-4 mr-1" />
                  Account
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="header-btn text-white hover:bg-white/10"
                onClick={handleLoginRedirect}
              >
                <User className="w-4 h-4 mr-1" />
                Login
              </Button>
            )}
            <Button
              variant="ghost"
              className="header-btn text-white hover:bg-white/10"
            >
              1834 HELP
            </Button>
          </div>
          <Button
            variant="ghost"
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside
          className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}
        >
          <div className="sidebar-content">
            <h2 className="sidebar-title">CREATION FLOW</h2>
            <nav className="sidebar-nav">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`nav-item ${
                      currentSection === section.id ? "active" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <h3 className="footer-title">Quick Start Guide</h3>
              <p className="footer-text">Create Yours Guide</p>
              <p className="footer-text">Tech Review Check</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Section 1: Select Your Actor */}
          <section
            ref={sectionRefs["select-avatar"]}
            className="dashboard-section"
          >
            <div className="section-header">
              <h2 className="section-title">SELECT YOUR ACTOR</h2>
              <Badge variant="secondary" className="section-badge">
                All Categories
              </Badge>
            </div>

            <div className="actors-grid">
              {mockActors.map((actor) => (
                <Card key={actor.id} className="actor-card">
                  <CardContent className="actor-card-content">
                    <div className="actor-image">
                      {actor.image ? (
                        <img src={actor.image} alt={actor.name} />
                      ) : (
                        <div className="placeholder-image">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="actor-info">
                      <h3 className="actor-name">{actor.name}</h3>
                      <p className="actor-category">{actor.category}</p>
                      <div className="actor-pricing">
                        <span className="price">₹{actor.price}</span>
                        <span className="credits">{actor.credits} Credits</span>
                      </div>
                    </div>
                    <Button
                      className="select-actor-btn"
                      onClick={() => handleActorSelect(actor)}
                      disabled={selectedActors.some((a) => a.id === actor.id)}
                    >
                      {selectedActors.some((a) => a.id === actor.id)
                        ? "Selected"
                        : "Select Actor"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="browse-more">
              <Button variant="outline" className="browse-btn">
                Browse More Actors
              </Button>
            </div>

            {/* Selected Actors Section */}
            {selectedActors.length > 0 && (
              <div className="selected-actors-section">
                <h3 className="subsection-title">YOUR SELECTION</h3>
                <div className="selected-actors-grid">
                  {selectedActors.map((actor) => (
                    <Card key={actor.id} className="selected-actor-card">
                      <CardContent className="selected-actor-content">
                        <div className="selected-actor-header">
                          <h4 className="selected-actor-name">{actor.name}</h4>
                          <div className="actor-controls">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLockActor(actor.id)}
                              className="lock-btn"
                            >
                              {actor.isLocked ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveActor(actor.id)}
                              className="remove-btn"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="actor-customization">
                          <div className="customization-section">
                            <h5>Voice Style</h5>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select voice style" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockVoiceStyles.map((style) => (
                                  <SelectItem key={style.id} value={style.name}>
                                    {style.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="customization-section">
                            <h5>Outfit</h5>
                            <div className="outfit-upload">
                              {actor.outfitImage ? (
                                <div className="outfit-preview">
                                  <img
                                    src={actor.outfitImage}
                                    alt="Outfit"
                                    className="outfit-image"
                                  />
                                  <div className="outfit-actions">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedActors((prev) =>
                                          prev.map((a) =>
                                            a.id === actor.id
                                              ? {
                                                  ...a,
                                                  outfitImage: null,
                                                  vtonResult: null,
                                                }
                                              : a
                                          )
                                        );
                                      }}
                                      className="cancel-outfit-btn"
                                    >
                                      Cancel
                                    </Button>
                                    <label className="reupload-btn">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleOutfitUpload(
                                            e.target.files[0],
                                            actor.id
                                          )
                                        }
                                        className="hidden-input"
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        as="span"
                                      >
                                        Reupload
                                      </Button>
                                    </label>
                                  </div>
                                  {actor.vtonResult && (
                                    <div className="vton-result">
                                      <p>VTON Result:</p>
                                      <img
                                        src={actor.vtonResult}
                                        alt="VTON Result"
                                        className="vton-image"
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Tabs
                                  defaultValue="upload"
                                  className="outfit-tabs"
                                >
                                  <TabsList>
                                    <TabsTrigger value="upload">
                                      Upload Image
                                    </TabsTrigger>
                                    <TabsTrigger value="prompt">
                                      Text Prompt
                                    </TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="upload">
                                    <label className="upload-area small">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleOutfitUpload(
                                            e.target.files[0],
                                            actor.id
                                          )
                                        }
                                        className="hidden-input"
                                      />
                                      <Shirt className="w-5 h-5" />
                                      <span>Upload Outfit</span>
                                    </label>
                                  </TabsContent>
                                  <TabsContent value="prompt">
                                    <Input placeholder="Describe the outfit..." />
                                  </TabsContent>
                                </Tabs>
                              )}
                            </div>
                          </div>

                          <div className="customization-section">
                            <h5>Languages</h5>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select languages" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockLanguages.map((lang) => (
                                  <SelectItem key={lang.id} value={lang.code}>
                                    {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            className="lock-add-btn"
                            onClick={() => handleLockActor(actor.id)}
                          >
                            {actor.isLocked ? "Locked & Added" : "Lock & Add"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="section-navigation">
                  <Button
                    className="next-section-btn"
                    onClick={() => scrollToSection("upload-script")}
                  >
                    Proceed to Script
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Upload Script */}
          <section
            ref={sectionRefs["upload-script"]}
            className="dashboard-section"
          >
            <div className="section-header">
              <h2 className="section-title">UPLOAD YOUR SCRIPT</h2>
            </div>

            <Card className="script-card">
              <CardContent className="script-content">
                <div className="script-upload-area">
                  <div className="upload-zone">
                    <Upload className="w-8 h-8" />
                    <p>Drag & Drop your script file here</p>
                    <Button variant="outline" className="browse-files-btn">
                      Browse Files
                    </Button>
                  </div>

                  <div className="script-divider">
                    <span>OR</span>
                  </div>

                  <div className="paste-script">
                    <p>Paste your script directly:</p>
                    <Textarea
                      placeholder="Enter your script here..."
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="script-textarea"
                      rows={10}
                    />
                  </div>
                </div>

                <div className="script-actions">
                  <Button
                    className="generate-storyboard-btn"
                    onClick={handleGenerateStoryboard}
                    disabled={isGenerating || !script.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Storyboard"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Storyboard Generation */}
          <section
            ref={sectionRefs["storyboard"]}
            className="dashboard-section"
          >
            <div className="section-header">
              <h2 className="section-title">STORYBOARD GENERATION</h2>
            </div>

            <div className="storyboard-grid">
              {storyboardFrames.map((frame) => (
                <Card key={frame.id} className="storyboard-card">
                  <CardContent className="storyboard-content">
                    <div className="frame-preview">
                      {frame.thumbnail ? (
                        <img src={frame.thumbnail} alt={frame.scene} />
                      ) : (
                        <div className="frame-placeholder">
                          <Film className="w-8 h-8" />
                          <p>Choose File to Add Image!</p>
                        </div>
                      )}
                    </div>

                    <div className="frame-info">
                      <h4>{frame.scene}</h4>
                      <p>{frame.description}</p>
                    </div>

                    <div className="frame-actions">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="frame-action-btn"
                      >
                        Upload Storyboard
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="frame-action-btn"
                      >
                        Generate New
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="frame-action-btn"
                        onClick={() => {
                          setStoryboardFrames((prev) =>
                            prev.map((f) =>
                              f.id === frame.id
                                ? { ...f, isLocked: !f.isLocked }
                                : f
                            )
                          );
                        }}
                      >
                        {frame.isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="storyboard-global-actions">
              <Button variant="outline" className="regenerate-all-btn">
                AI Generate Images
              </Button>
              <Button
                className="proceed-video-btn"
                onClick={() => scrollToSection("video-generation")}
              >
                Proceed to Video
              </Button>
            </div>
          </section>

          {/* Section 4: Video Generation */}
          <section
            ref={sectionRefs["video-generation"]}
            className="dashboard-section"
          >
            <div className="section-header">
              <h2 className="section-title">SELECT VIDEO MODEL</h2>
            </div>

            <div className="video-models-grid">
              {mockVideoModels.map((model) => (
                <Card
                  key={model.id}
                  className={`video-model-card ${
                    selectedVideoModel?.id === model.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedVideoModel(model)}
                >
                  <CardContent className="video-model-content">
                    <div className="model-header">
                      <h3>{model.name}</h3>
                      <div className="model-badges">
                        <Badge className="credits-badge">{model.credits}</Badge>
                        {model.recommended && (
                          <Badge className="recommended-badge">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="model-description">{model.description}</p>
                    <div className="model-features">
                      {model.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="feature-badge"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="video-generation-section">
              <Button
                className="generate-video-btn"
                disabled={!selectedVideoModel}
                onClick={async () => {
                  setIsGenerating(true);
                  toast({
                    title: "Video Generation Started",
                    description:
                      "Your video is being generated. This may take a few minutes.",
                  });

                  try {
                    const result = await mockFunctions.generateVideo({
                      model: selectedVideoModel,
                      storyboard: storyboardFrames,
                      actors: selectedActors,
                    });

                    setUploadedVideo(result.videoUrl);
                    toast({
                      title: "Success",
                      description: result.message,
                    });
                  } catch (error) {
                    toast({
                      title: "Generation Failed",
                      description:
                        "Failed to generate video. Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsGenerating(false);
                  }
                }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  "Generate Video"
                )}
              </Button>
            </div>

            {/* Video Player Section */}
            <div className="video-preview-section">
              <h3>Video Preview</h3>
              <div className="video-player-container">
                {uploadedVideo ? (
                  <video controls className="video-player" autoPlay>
                    <source src={uploadedVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="video-placeholder">
                    <Play className="w-12 h-12" />
                    <p>Video will appear here after generation</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
