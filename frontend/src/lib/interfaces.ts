interface IContextData {
  pageContent: string;
  metadata: {
    detection_class_prob: number;
    coordinates: {
      points: number[][];
      system: string;
      layout_width: number;
      layout_height: number;
    };
    last_modified: string;
    filetype: string;
    languages: string[];
    page_number: number;
    parent_id: string;
    file_directory: string;
    filename: string;
  };
}
interface IChatStruct {
  input: string;
  chat_history?: any[];
  context: IContextData[];
  answer: string;
}

interface IModalContextData {
  pageContent: string;
  pageNumber: number;
}

interface IQuestionStruct {
  question: string;
  q_id: string;
}

interface dbConversationStruct {
  q_id?: string;
  question?: string;
  model_answer?: string;
  model_context?: IContextData[];
  is_annotated?: boolean;
  annotated_answer?: string;
  annotated_context?: IContextData[];
}
