export interface Module {
  id: string;
  type: 'HERO' | 'DESC' | 'IMAGE_ONLY';
  title: string;
  content: string;
  image?: string;
}

export interface EditorState {
  productName: string;
  baseDescription: string;
  modules: Module[];
}