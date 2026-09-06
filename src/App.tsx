import React, { useState, useEffect, useRef } from 'react';
import { CardData, CardTemplate, DraftData, MainTab, ProjectItem } from './types';
import {
  getProjects,
  saveProject,
  deleteProject as removeProject,
  toggleProjectFavorite,
  getFavoriteTemplateIds,
  toggleFavoriteTemplate,
  getDraft,
  saveDraft,
  clearDraft,
  getUserConsent,
  saveUserConsent,
} from './utils/storage';

import { AndroidFrame } from './components/AndroidFrame';
import { TemplateGrid } from './components/TemplateGrid';
import { EditorView } from './components/EditorView';
import { ProjectsView } from './components/ProjectsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { ExportModal } from './components/ExportModal';
import { TutorialModal } from './components/TutorialModal';
import { AboutModal } from './components/AboutModal';
import { ConsentModal, type LegalDocType } from './components/ConsentModal';
import { AgreementModal } from './components/AgreementModal';
import { UserAgreementContent, PrivacyPolicyContent } from './components/LegalContents';
import { ShieldX } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<MainTab>('templates');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeCardData, setActiveCardData] = useState<CardData | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | undefined>(undefined);

  // Storage State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [draft, setDraft] = useState<DraftData | null>(null);

  // Modals
  const [exportModalData, setExportModalData] = useState<CardData | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [privacyOpen, setPrivacyOpen] = useState<boolean>(false);

  // 用户协议与隐私政策：首次启动必须同意后才能进入应用
  const [consentStatus, setConsentStatus] = useState<'pending' | 'accepted' | 'declined'>(() =>
    getUserConsent()?.accepted ? 'accepted' : 'pending'
  );
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);

  // Initial Data Load
  useEffect(() => {
    setProjects(getProjects());
    setFavoriteIds(getFavoriteTemplateIds());
    setDraft(getDraft());
  }, []);

  // Handle Template Selection -> Enter Editor
  const handleSelectTemplate = (template: CardTemplate) => {
    const clonedData: CardData = JSON.parse(JSON.stringify(template.defaultData));
    setActiveCardData(clonedData);
    setActiveTemplateId(template.id);
    setIsEditing(true);
  };

  // Handle Create Blank Card -> Enter Editor
  const handleCreateBlank = () => {
    const blankCard: CardData = {
      id: `card-${Date.now()}`,
      name: '自定义空白名片',
      widthMm: 90,
      heightMm: 54,
      themeId: 'theme-classic-gold',
      activeSide: 'front',
      front: {
        background: { type: 'solid', color: '#18181B' },
        elements: [
          {
            id: 'elem-name-1',
            type: 'text',
            textType: 'name',
            content: '您的姓名',
            style: {
              x: 80,
              y: 100,
              fontSize: 40,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Noto Sans SC', sans-serif",
              zIndex: 1,
            },
          },
          {
            id: 'elem-title-1',
            type: 'text',
            textType: 'title',
            content: '职位头衔 / 专业领域',
            style: {
              x: 80,
              y: 160,
              fontSize: 18,
              fontWeight: 500,
              color: '#D4AF37',
              fontFamily: "'Noto Sans SC', sans-serif",
              zIndex: 2,
            },
          },
          {
            id: 'elem-phone-1',
            type: 'text',
            textType: 'phone',
            content: '+86 138 0000 0000',
            style: {
              x: 80,
              y: 280,
              fontSize: 16,
              color: '#E4E4E7',
              fontFamily: "'Noto Sans SC', sans-serif",
              zIndex: 3,
            },
          },
          {
            id: 'elem-email-1',
            type: 'text',
            textType: 'email',
            content: 'contact@domain.com',
            style: {
              x: 80,
              y: 320,
              fontSize: 16,
              color: '#E4E4E7',
              fontFamily: "'Noto Sans SC', sans-serif",
              zIndex: 4,
            },
          },
          {
            id: 'elem-qr-1',
            type: 'qr',
            content: 'https://meixu.card',
            style: {
              x: 680,
              y: 170,
              width: 140,
              height: 140,
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              padding: 6,
              zIndex: 5,
            },
          },
        ],
      },
      back: {
        background: { type: 'solid', color: '#18181B' },
        elements: [
          {
            id: 'elem-back-logo',
            type: 'text',
            content: 'MEIXU DESIGN',
            style: {
              x: 300,
              y: 240,
              fontSize: 32,
              fontWeight: 700,
              color: '#D4AF37',
              textAlign: 'center',
              letterSpacing: 4,
              zIndex: 1,
            },
          },
        ],
      },
    };

    setActiveCardData(blankCard);
    setActiveTemplateId(undefined);
    setIsEditing(true);
  };

  // Toggle Template Favorite
  const handleToggleFavoriteTemplate = (templateId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleFavoriteTemplate(templateId);
    setFavoriteIds(updated);
  };

  // Save Card to Projects
  const handleSaveToProjects = (data: CardData) => {
    const updatedProjects = saveProject(data, activeTemplateId);
    setProjects(updatedProjects);
  };

  // Edit Existing Project
  const handleEditProject = (project: ProjectItem) => {
    setActiveCardData(JSON.parse(JSON.stringify(project.data)));
    setActiveTemplateId(project.templateId);
    setIsEditing(true);
  };

  // Duplicate Project
  const handleDuplicateProject = (project: ProjectItem) => {
    const copyData: CardData = JSON.parse(JSON.stringify(project.data));
    copyData.id = `card-${Date.now()}`;
    copyData.name = `${project.name} (副本)`;
    const updated = saveProject(copyData, project.templateId);
    setProjects(updated);
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    const updated = removeProject(id);
    setProjects(updated);
  };

  // Toggle Project Favorite
  const handleToggleProjectFav = (id: string) => {
    const updated = toggleProjectFavorite(id);
    setProjects(updated);
  };

  // Continue Draft
  const handleContinueDraft = (d: DraftData) => {
    setActiveCardData(JSON.parse(JSON.stringify(d.data)));
    setActiveTemplateId(d.templateId);
    setIsEditing(true);
  };

  // Clear Draft
  const handleClearDraft = () => {
    clearDraft();
    setDraft(null);
  };

  // Auto-save Draft (state updates instantly, localStorage write is debounced
  // to avoid a full JSON serialization per drag frame / keystroke)
  const draftTimerRef = useRef<number | null>(null);
  const handleAutoSaveDraft = (data: CardData) => {
    setDraft({ data, templateId: activeTemplateId, updatedAt: Date.now() });
    if (draftTimerRef.current) {
      window.clearTimeout(draftTimerRef.current);
    }
    draftTimerRef.current = window.setTimeout(() => {
      saveDraft(data, activeTemplateId);
    }, 400);
  };

  // Android / browser back button: while editing, go back to template grid
  // instead of leaving the app (works in Capacitor WebView without extra plugin)
  const editorHistoryPushedRef = useRef(false);
  useEffect(() => {
    if (!isEditing) {
      editorHistoryPushedRef.current = false;
      return;
    }
    if (!editorHistoryPushedRef.current) {
      window.history.pushState({ meixuEditor: true }, '');
      editorHistoryPushedRef.current = true;
    }
    const onPopState = () => {
      editorHistoryPushedRef.current = false;
      setIsEditing(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isEditing]);

  return (
    <AndroidFrame
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setIsEditing(false);
        setCurrentTab(tab);
      }}
      hideTabBar={isEditing}
    >
      {/* View Switcher: Editor Mode OR Main Tab Views */}
      {isEditing && activeCardData ? (
        <EditorView
          initialData={activeCardData}
          templateId={activeTemplateId}
          onBack={() => setIsEditing(false)}
          onSaveToProjects={handleSaveToProjects}
          onOpenExport={(data) => setExportModalData(data)}
          onAutoSaveDraft={handleAutoSaveDraft}
        />
      ) : (
        <>
          {currentTab === 'templates' && (
            <TemplateGrid
              onSelectTemplate={handleSelectTemplate}
              onCreateBlank={handleCreateBlank}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavoriteTemplate}
            />
          )}

          {currentTab === 'works' && (
            <ProjectsView
              projects={projects}
              onEditProject={handleEditProject}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onToggleFavorite={handleToggleProjectFav}
              onCreateNew={() => {
                setCurrentTab('templates');
              }}
              onExportProject={(proj) => setExportModalData(proj.data)}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavoriteTemplate}
              onSelectTemplate={handleSelectTemplate}
              draft={draft}
              onContinueDraft={handleContinueDraft}
              onClearDraft={handleClearDraft}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              onOpenTutorials={() => setTutorialOpen(true)}
              onOpenAbout={() => setAboutOpen(true)}
              onOpenPrivacy={() => setPrivacyOpen(true)}
            />
          )}
        </>
      )}

      {/* High-Resolution / 300DPI Print Export Modal */}
      {exportModalData && (
        <ExportModal
          cardData={exportModalData}
          isOpen={!!exportModalData}
          onClose={() => setExportModalData(null)}
        />
      )}

      {/* Illustrated Tutorials Modal */}
      <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />

      {/* About Us Modal */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      {/* Privacy Policy Modal —— 与启动弹窗中的《隐私政策》全文完全一致（复用同一组件） */}
      {privacyOpen && (
        <AgreementModal title="隐私政策" onClose={() => setPrivacyOpen(false)}>
          <PrivacyPolicyContent />
        </AgreementModal>
      )}

      {/* Startup Consent Flow: 用户协议与隐私政策 */}
      {consentStatus === 'pending' && (
        <ConsentModal
          onAccept={() => {
            saveUserConsent();
            setConsentStatus('accepted');
          }}
          onDeclined={() => setConsentStatus('declined')}
          onOpenDocument={setLegalDoc}
        />
      )}

      {/* 拒绝协议后的阻断页 */}
      {consentStatus === 'declined' && (
        <div className="fixed inset-0 z-60 bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
          <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-5">
            <ShieldX size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">您已拒绝用户协议与隐私政策</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
            拒绝后无法使用美序名片的服务。如需继续使用，请重新查看并同意《用户服务协议》和《隐私政策》。
          </p>
          <button
            id="consent-reagree-btn"
            onClick={() => setConsentStatus('pending')}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors"
          >
            重新查看并同意
          </button>
        </div>
      )}

      {/* 协议全文查看弹窗（层级高于同意弹窗） */}
      {legalDoc && (
        <AgreementModal
          title={legalDoc === 'agreement' ? '用户服务协议' : '隐私政策'}
          onClose={() => setLegalDoc(null)}
        >
          {legalDoc === 'agreement' ? <UserAgreementContent /> : <PrivacyPolicyContent />}
        </AgreementModal>
      )}
    </AndroidFrame>
  );
}
