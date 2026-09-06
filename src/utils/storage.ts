import { CardData, DraftData, ProjectItem } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'meixu_saved_projects_v1',
  DRAFT: 'meixu_current_draft_v1',
  FAVORITE_TEMPLATES: 'meixu_fav_templates_v1',
  APP_SETTINGS: 'meixu_app_settings_v1',
  CONSENT: 'meixu_user_consent_v1',
};

/** 协议版本号：内容有实质变更时 +1，可据此要求用户重新同意 */
export const AGREEMENT_VERSION = 1;

export interface UserConsent {
  accepted: boolean;
  acceptedAt: number;
  version: number;
}

export function getUserConsent(): UserConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONSENT);
    return raw ? (JSON.parse(raw) as UserConsent) : null;
  } catch {
    return null;
  }
}

export function saveUserConsent(version: number = AGREEMENT_VERSION): void {
  const consent: UserConsent = {
    accepted: true,
    acceptedAt: Date.now(),
    version,
  };
  try {
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(consent));
  } catch (e) {
    console.error('Failed to save user consent', e);
  }
}

// --- Projects ---
export function getProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('Failed to load projects from localStorage', e);
    return [];
  }
}

export function saveProject(cardData: CardData, templateId?: string): ProjectItem[] {
  // 注意：localStorage 配额不足时 setItem 会抛出异常，此处故意不吞掉，
  // 由调用方（App.handleSaveToProjects）向用户展示失败提示。
  const list = getProjects();
  const projectId = cardData.id || `proj-${Date.now()}`;
  const existingIndex = list.findIndex((p) => p.id === projectId || p.data.id === projectId);

  const projectItem: ProjectItem = {
    id: projectId,
    templateId,
    name: cardData.name || '未命名名片',
    updatedAt: Date.now(),
    createdAt: existingIndex >= 0 ? list[existingIndex].createdAt : Date.now(),
    data: cardData,
    isFavorite: existingIndex >= 0 ? list[existingIndex].isFavorite : false,
  };

  if (existingIndex >= 0) {
    list[existingIndex] = projectItem;
  } else {
    list.unshift(projectItem);
  }

  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
  return list;
}

export function deleteProject(id: string): ProjectItem[] {
  try {
    const list = getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Failed to delete project', e);
    return getProjects();
  }
}

export function toggleProjectFavorite(id: string): ProjectItem[] {
  try {
    const list = getProjects();
    const target = list.find((p) => p.id === id);
    if (target) {
      target.isFavorite = !target.isFavorite;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    }
    return list;
  } catch (e) {
    console.error('Failed to toggle project favorite', e);
    return getProjects();
  }
}

// --- Draft ---
export function saveDraft(data: CardData, templateId?: string): void {
  try {
    const draft: DraftData = {
      data,
      templateId,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save draft', e);
  }
}

export function getDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load draft', e);
    return null;
  }
}

export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEYS.DRAFT);
}

// --- Template Favorites ---
export function getFavoriteTemplateIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITE_TEMPLATES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavoriteTemplate(templateId: string): string[] {
  try {
    const list = getFavoriteTemplateIds();
    const idx = list.indexOf(templateId);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(templateId);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITE_TEMPLATES, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Failed to toggle template favorite', e);
    return getFavoriteTemplateIds();
  }
}

// --- Storage Size & Reset ---
export function getStorageSize(): string {
  try {
    let totalBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
    return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
  } catch (e) {
    return '0 KB';
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
    localStorage.removeItem(STORAGE_KEYS.FAVORITE_TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.APP_SETTINGS);
  } catch (e) {
    console.error('Failed to clear all data', e);
  }
}
