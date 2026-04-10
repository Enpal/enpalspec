import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
  type SkillTemplate,
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getExploreSkillTemplate,
  getFeedbackSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOpsxApplyCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxOnboardCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxProposeCommandTemplate,
  getOpsxProposeSkillTemplate,
  getOpsxVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent } from '../../../src/core/shared/skill-generation.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: '542fc4659fcab383adddbc6de89417ae80eb7e8d600c43f82db895a4bd205bf5',
  getNewChangeSkillTemplate: 'da2add8f373f05b271be8fba4008b96974a4455b9f04d3a0c7317c03687e0b25',
  getContinueChangeSkillTemplate: '25d8b31041026be201eb108d2833e2bb73f4de32cc5cd6075b5b6aa776d0fa90',
  getApplyChangeSkillTemplate: 'd1499b0f09abcf31bbf09e3197993ece7fea1a9ac7a9fcac85596e4726e4b06c',
  getFfChangeSkillTemplate: '5ee79ba3cb3a88c99064a41216f1defa1337c778c95d7d7c8616e1a5f30fde79',
  getSyncSpecsSkillTemplate: 'a0b209d22b5f7c8f631f662efce1d6699c01f3884419effdd29b8450414bd0f8',
  getOnboardSkillTemplate: '04f889f2f02f9d8aca4c3d4a9ec61163d0f1630cdd361d162b8f8e0e48737a1d',
  getOpsxExploreCommandTemplate: '4f98019e13adc2c1ca9d61f26817ddca748adafc71206c518d9007438cde91f1',
  getOpsxNewCommandTemplate: 'a300d31247f02b206d4042a6c3bb73e823575c299b31a0fc96630cb2353bd79f',
  getOpsxContinueCommandTemplate: 'ca7e21dbc1a6d4933b1e9d2f4bbba2eadfd7460d8ea473f34741a55321e1e3b9',
  getOpsxApplyCommandTemplate: '11d9ed1877288714cfa5b5fa53dd1e2ce6375c9e2be506347a3e6225606e56aa',
  getOpsxFfCommandTemplate: '892b09ff4dbc6ea842ff6ed3f5694506701388266237a026924fe52985dfb54b',
  getArchiveChangeSkillTemplate: 'e034afc8bf64de8a834c2c2c0f47e07b072cc90645f298bc38300816194eb68f',
  getBulkArchiveChangeSkillTemplate: '0a40a576d2029853423c54686c07c300317a43f94b8e0f9433b441025b41e513',
  getOpsxSyncCommandTemplate: 'e789bd8585f38f44353dfc381d31e92f45e8829f0fe6fd8c591d9163067232d2',
  getVerifyChangeSkillTemplate: '71ab21f7350193cb62e06dea88f4521f4ad1d74be0b74b9b81f5fa8202c4271f',
  getOpsxArchiveCommandTemplate: '4658eda4b62ce48c7a575bf2db81065240486f9abe84cc1aa8b58a432de12d9e',
  getOpsxOnboardCommandTemplate: '69e94c11e23855825ab5362bd95bab82b402790a7a984a926bd4784372fa6f2a',
  getOpsxBulkArchiveCommandTemplate: '809edaaed34821b73ea4bc20fc23557307def6b437642bfd1e1a3c3a9de6696c',
  getOpsxVerifyCommandTemplate: 'be7b545b2a7caf52638e02c5997e6c71867a93f22eda0c1bf172edef76ec3021',
  getOpsxProposeSkillTemplate: '495c770cd7b03f1ed5ed8e5ad1d52ca6e175c1071f137769a26ab81dae255799',
  getOpsxProposeCommandTemplate: '74a7192e8dd195c92e8ee532789514a4ee7ae4dd0799e7321fd6b806144fa6b0',
  getFeedbackSkillTemplate: '0e7ddd56b369d496769320595ca47d52a7f4d7e833b05fd44ea40b39ac186cd1',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'enpalspec-explore': '5a2a1fd0d2386038fb87dc5649ea9f091bc557b407148a2145bc5f05251474e8',
  'enpalspec-new-change': '0334e8f6cd05eebc003c0f667898f23677561cac5e08933f7b89addb064b2ee5',
  'enpalspec-continue-change': '232cc380c83b9fd9ff84f8abdadee9c19ec37e079c50ed4b2ca201eae9c7469e',
  'enpalspec-apply-change': '22771b6179ed5306c61559a4d3556cf2bb7399131a6f56aa38e4e9fbc55b8b47',
  'enpalspec-ff-change': '03111dc44003355490c04e15d515ac962f28079088356d1e08a3299a311b705f',
  'enpalspec-sync-specs': '5df3e01f73093e623d4d5583d80d9c53cdd46c9b066079200a9c23b4fcb31fe4',
  'enpalspec-archive-change': '25f96466b193d83cc38a54f204e36518a829fc0f0194069d7b1b5095bc1f3b54',
  'enpalspec-bulk-archive-change': 'af0f4be076590f663b1dff9c29bb8a799150782487ff270f8c74744d41795d9d',
  'enpalspec-verify-change': '0bce4bd7b6ee727296b2c624e7951f9b1e36cd6820b520d692d184983a5769ca',
  'enpalspec-onboard': '3c8520790bac33b53aca1c61b93d14f4d6b917e6ae1d7676b69200752b102817',
  'enpalspec-propose': '96c690852550bc3c4c2518d15dead74d79a98ece4b05ef11092d57f4ce70cdfe',
};

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('skill templates split parity', () => {
  it('preserves all template function payloads exactly', () => {
    const functionFactories: Record<string, () => unknown> = {
      getExploreSkillTemplate,
      getNewChangeSkillTemplate,
      getContinueChangeSkillTemplate,
      getApplyChangeSkillTemplate,
      getFfChangeSkillTemplate,
      getSyncSpecsSkillTemplate,
      getOnboardSkillTemplate,
      getOpsxExploreCommandTemplate,
      getOpsxNewCommandTemplate,
      getOpsxContinueCommandTemplate,
      getOpsxApplyCommandTemplate,
      getOpsxFfCommandTemplate,
      getArchiveChangeSkillTemplate,
      getBulkArchiveChangeSkillTemplate,
      getOpsxSyncCommandTemplate,
      getVerifyChangeSkillTemplate,
      getOpsxArchiveCommandTemplate,
      getOpsxOnboardCommandTemplate,
      getOpsxBulkArchiveCommandTemplate,
      getOpsxVerifyCommandTemplate,
      getOpsxProposeSkillTemplate,
      getOpsxProposeCommandTemplate,
      getFeedbackSkillTemplate,
    };

    const actualHashes = Object.fromEntries(
      Object.entries(functionFactories).map(([name, fn]) => [name, hash(stableStringify(fn()))])
    );

    expect(actualHashes).toEqual(EXPECTED_FUNCTION_HASHES);
  });

  it('preserves generated skill file content exactly', () => {
    // Intentionally excludes getFeedbackSkillTemplate: skillFactories only models templates
    // deployed via generateSkillContent, while feedback is covered in function payload parity.
    const skillFactories: Array<[string, () => SkillTemplate]> = [
      ['enpalspec-explore', getExploreSkillTemplate],
      ['enpalspec-new-change', getNewChangeSkillTemplate],
      ['enpalspec-continue-change', getContinueChangeSkillTemplate],
      ['enpalspec-apply-change', getApplyChangeSkillTemplate],
      ['enpalspec-ff-change', getFfChangeSkillTemplate],
      ['enpalspec-sync-specs', getSyncSpecsSkillTemplate],
      ['enpalspec-archive-change', getArchiveChangeSkillTemplate],
      ['enpalspec-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['enpalspec-verify-change', getVerifyChangeSkillTemplate],
      ['enpalspec-onboard', getOnboardSkillTemplate],
      ['enpalspec-propose', getOpsxProposeSkillTemplate],
    ];

    const actualHashes = Object.fromEntries(
      skillFactories.map(([dirName, createTemplate]) => [
        dirName,
        hash(generateSkillContent(createTemplate(), 'PARITY-BASELINE')),
      ])
    );

    expect(actualHashes).toEqual(EXPECTED_GENERATED_SKILL_CONTENT_HASHES);
  });
});
