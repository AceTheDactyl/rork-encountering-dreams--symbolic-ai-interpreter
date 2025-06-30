import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { Dream } from '@/types/dream';
import { getPersona } from '@/constants/personas';
import { getDreamType } from '@/constants/dreamTypes';

export class ExportService {
  static async exportDreamsToDocx(dreams: Dream[], filename: string = 'my-dreams'): Promise<void> {
    try {
      const doc = this.createDocxDocument(dreams);
      const buffer = await Packer.toBuffer(doc);
      
      if (Platform.OS === 'web') {
        await this.downloadOnWeb(buffer, `${filename}.docx`);
      } else {
        await this.shareOnMobile(buffer, `${filename}.docx`);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export dreams. Please try again.');
    }
  }

  static async exportSingleDream(dream: Dream): Promise<void> {
    const filename = dream.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    await this.exportDreamsToDocx([dream], filename);
  }

  private static createDocxDocument(dreams: Dream[]): Document {
    const children: Paragraph[] = [];

    // Title page
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Dream Journal",
            bold: true,
            size: 48,
          }),
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Exported on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}`,
            italics: true,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${dreams.length} dream${dreams.length !== 1 ? 's' : ''} recorded`,
            size: 20,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      })
    );

    // Dreams
    dreams.forEach((dream, index) => {
      const persona = getPersona(dream.persona);
      const dreamType = getDreamType(dream.dreamType);
      
      // Dream title
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: dream.name,
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      // Dream metadata
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Interpreted by ${persona.name} • `,
              italics: true,
              size: 20,
            }),
            new TextRun({
              text: `${dreamType?.name || 'Unknown Type'} Dream • `,
              italics: true,
              size: 20,
            }),
            new TextRun({
              text: new Date(dream.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 300 },
        })
      );

      // Dream classification info
      if (dreamType) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Dream Classification",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Time Index: ${dreamType.timeIndex} • Function: ${dreamType.primaryFunction}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Symbolic Field: ${dreamType.symbolicField}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Typical Phenomena: ${dreamType.typicalPhenomena}`,
                size: 20,
              }),
            ],
            spacing: { after: 300 },
          })
        );
      }

      // Your Dream section
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Your Dream",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      // Split dream text into paragraphs
      const dreamParagraphs = dream.text.split('\n').filter(p => p.trim());
      dreamParagraphs.forEach(paragraph => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: paragraph.trim(),
                size: 22,
              }),
            ],
            spacing: { after: 150 },
          })
        );
      });

      // Interpretation section
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${persona.name}'s Interpretation`,
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        })
      );

      // Split interpretation into paragraphs
      const interpretationParagraphs = dream.interpretation.split('\n').filter(p => p.trim());
      interpretationParagraphs.forEach(paragraph => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: paragraph.trim(),
                size: 22,
              }),
            ],
            spacing: { after: 150 },
          })
        );
      });

      // Add page break between dreams (except for the last one)
      if (index < dreams.length - 1) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "", break: 1 })],
            pageBreakBefore: true,
          })
        );
      }
    });

    return new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });
  }

  private static async downloadOnWeb(buffer: ArrayBuffer, filename: string): Promise<void> {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static async shareOnMobile(buffer: ArrayBuffer, filename: string): Promise<void> {
    const uint8Array = new Uint8Array(buffer);
    const base64 = this.arrayBufferToBase64(uint8Array);
    
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        dialogTitle: 'Export Dreams',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  }

  private static arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = buffer;
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}