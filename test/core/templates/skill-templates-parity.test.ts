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
  getExploreSkillTemplate: '98b4e49c9739bd038c26b1c168403ac32eff2934869c1282b6e64d70105eab78',
  getNewChangeSkillTemplate: 'da2add8f373f05b271be8fba4008b96974a4455b9f04d3a0c7317c03687e0b25',
  getContinueChangeSkillTemplate: '2e7ac3d49c397f4a9342b5a2d64c3a5ab4abdd0546be271775de9f0ad9e6aad5',
  getApplyChangeSkillTemplate: '39330c2cdf0e2ddac10e8de4c4a05f3a7afa4e648c2bbeae4e857e70758e7bb5',
  getFfChangeSkillTemplate: '5ee79ba3cb3a88c99064a41216f1defa1337c778c95d7d7c8616e1a5f30fde79',
  getSyncSpecsSkillTemplate: 'a0b209d22b5f7c8f631f662efce1d6699c01f3884419effdd29b8450414bd0f8',
  getOnboardSkillTemplate: 'b41bcb2447f8312aef3f8736baa78af89ebfa7ef0ad9aa194140831781f81cef',
  getOpsxExploreCommandTemplate: '0fac843f1ebda93922c2ad9f7bd561aec45fca4c83690e71a827a6d697b8815e',
  getOpsxNewCommandTemplate: 'a300d31247f02b206d4042a6c3bb73e823575c299b31a0fc96630cb2353bd79f',
  getOpsxContinueCommandTemplate: '7fc5831887d533beb75b32c7b5229bd52e2fc7567ab1a541ea696b7da78f3329',
  getOpsxApplyCommandTemplate: '2ce7ba02e5cfc1c041f7af440c19860fb65cd199913fd0a39ba6ba1e575d6bb0',
  getOpsxFfCommandTemplate: '892b09ff4dbc6ea842ff6ed3f5694506701388266237a026924fe52985dfb54b',
  getArchiveChangeSkillTemplate: 'c76358ffd9284913e05eb8cb664cefa55476742f664f444ad10bb093df55f648',
  getBulkArchiveChangeSkillTemplate: '0a40a576d2029853423c54686c07c300317a43f94b8e0f9433b441025b41e513',
  getOpsxSyncCommandTemplate: 'e789bd8585f38f44353dfc381d31e92f45e8829f0fe6fd8c591d9163067232d2',
  getVerifyChangeSkillTemplate: '70047c0d0b034fa81079c8bb56e6ee613e5c71f240d287e927fcd242c3587e91',
  getOpsxArchiveCommandTemplate: '21310d44781868c02e27e754fa80dec1e6aa277ee057675aa4d7bb9356133bf4',
  getOpsxOnboardCommandTemplate: '7951caa6a4694faeb0c244b6f7afe4257a1ede6c7c04a11db40727f51d2573fe',
  getOpsxBulkArchiveCommandTemplate: '809edaaed34821b73ea4bc20fc23557307def6b437642bfd1e1a3c3a9de6696c',
  getOpsxVerifyCommandTemplate: 'fbaba5b91b1d1ca40ab71053979254bb0641a7c1362480ca70cdb3a2919a0fa7',
  getOpsxProposeSkillTemplate: '1e0d716c65c97d8cdc6a8528f20f362643f651a272b2aba83e43cfa3ea1e5de8',
  getOpsxProposeCommandTemplate: '873f6ab0f2f1274b1ad82898dd6a46b8e1e97db4212338c8cb989af4aad52f4c',
  getFeedbackSkillTemplate: '0e7ddd56b369d496769320595ca47d52a7f4d7e833b05fd44ea40b39ac186cd1',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'enpalspec-explore': '116cf094ce67e515c39a3d54bfe480ad1fe176a32251136970ad15a449045f88',
  'enpalspec-new-change': '0334e8f6cd05eebc003c0f667898f23677561cac5e08933f7b89addb064b2ee5',
  'enpalspec-continue-change': '175c874ad4e1a99ebce449b920e34b0067d4a8bbdabd95a32cd117c297f896c2',
  'enpalspec-apply-change': 'fc9a3599bcf417a27f19fe7f827edab401548a8a6a07e9007bd6f3ac8ffc9a28',
  'enpalspec-ff-change': '03111dc44003355490c04e15d515ac962f28079088356d1e08a3299a311b705f',
  'enpalspec-sync-specs': '5df3e01f73093e623d4d5583d80d9c53cdd46c9b066079200a9c23b4fcb31fe4',
  'enpalspec-archive-change': '23dd33435a8e58831b861e6a0a68e1fa277a1cea2fb1113702140f7fcad7aad5',
  'enpalspec-bulk-archive-change': 'af0f4be076590f663b1dff9c29bb8a799150782487ff270f8c74744d41795d9d',
  'enpalspec-verify-change': 'd3e65c33ede3fa0960d63a15c9b47d191c24d4ecaafb13062adca2780b0ec703',
  'enpalspec-onboard': '3bffdc237cdfdbed07bac28e69ff2307fa426f5b314fc8b8493a5c81813faf4c',
  'enpalspec-propose': '46e085441466ccea2b5c5cd3688777e6babe95a887ff52d02738e59abe6fbcab',
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
